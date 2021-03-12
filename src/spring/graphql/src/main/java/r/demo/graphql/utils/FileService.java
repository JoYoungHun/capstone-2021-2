package r.demo.graphql.utils;

import edu.stanford.nlp.ling.CoreLabel;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.poifs.filesystem.OfficeXmlFileException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import r.demo.graphql.domain.content.ContentRepo;
import r.demo.graphql.domain.files.FileInfo;
import r.demo.graphql.domain.files.FileInfoRepo;
import r.demo.graphql.domain.word.Word;
import r.demo.graphql.domain.word.WordRepo;
import r.demo.graphql.response.ExcelResponse;
import r.demo.graphql.response.FileResponse;
import r.demo.graphql.types.Paragraph;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class FileService {
    @Value("${aws.bucket}") private String bucket;
    private final FileInfoRepo fileRepo;
    private final S3Client s3Client;
    private final ContentRepo contentRepo;
    private final WordRepo wordRepo;
    private final StanfordLemmatizer lemmatizer;

    public FileService(FileInfoRepo fileRepo, S3Client s3Client,
                       ContentRepo contentRepo, WordRepo wordRepo, @Lazy StanfordLemmatizer lemmatizer) {
        this.fileRepo = fileRepo;
        this.s3Client = s3Client;
        this.contentRepo = contentRepo;
        this.wordRepo = wordRepo;
        this.lemmatizer = lemmatizer;
    }

    @Transactional(rollbackFor = { Exception.class })
    public FileResponse upload(MultipartFile file) {
        try {
            if (file == null || file.isEmpty())
                throw new IllegalArgumentException();

            Random random = new Random();
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
            String fileFormat = (file.getOriginalFilename() != null ? file.getOriginalFilename().split("\\.")[1] : "PNG");
            String keyName = simpleDateFormat.format(new Date()) + "_" + random.nextInt(1000) + "." + fileFormat;
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(keyName)
                            .contentType(file.getContentType())
                            .contentDisposition(";filename=" + keyName)
                            .contentLength((long) file.getBytes().length).build(),
                    RequestBody.fromByteBuffer(ByteBuffer.wrap(file.getBytes())));

            final URL reportUrl = s3Client.utilities().getUrl(GetUrlRequest.builder().bucket(bucket).key(keyName).build());
            FileInfo fileInfo = fileRepo.save(FileInfo.builder()
                    .uuid(keyName).name(file.getName()).url(reportUrl.toString()).build());
            return new FileResponse(HttpStatus.OK.value(), fileInfo.getId(), fileInfo.getUrl());
        } catch (Exception e) {
            e.printStackTrace();
            return new FileResponse(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    public void downloadExcelFormat(HttpServletResponse response, Long contentsKey) throws IOException {
        try {
            Workbook workbook = new HSSFWorkbook();
            HSSFSheet sheet = (HSSFSheet) workbook.createSheet("단어 엑셀 업로드");
            Row row;
            Cell cell;
            CellStyle headStyle = this.headerStyles(workbook);
            CellStyle bodyStyle = this.bodyStyle(workbook);

            List<HashMap<String, String>> headers = new ArrayList<>();
            HashMap<String, String> column = new HashMap<>(), column2 = new HashMap<>();
            column.put("column", "영단어");
            column2.put("column", "단어 뜻");
            headers.add(column);
            headers.add(column2);

            if (contentsKey == null) {
                int rowIdx = 0;
                row = sheet.createRow(rowIdx);

                for (int i = 0; i < headers.size(); i++) {
                    sheet.setColumnWidth(rowIdx, 10000);
                    cell = row.createCell(rowIdx);
                    cell.setCellValue(headers.get(i).get("column"));

                    cell.setCellStyle(headStyle);
                    sheet.setDefaultColumnStyle(i, bodyStyle);
                    rowIdx++;
                }
            } else if (contentsKey > 0) {
                List<Word> words = wordRepo.findAllByContentOrderBySequence(contentRepo.findById(contentsKey).orElseThrow(IllegalArgumentException::new));
                for (int i = 0; i < words.size(); i++) {
                    row = sheet.createRow(i);
                    for (int j = 0; j < headers.size(); j++) {
                        sheet.setColumnWidth(j, 10000);
                        cell = row.createCell(j);

                        if (i == 0) {
                            cell.setCellValue(headers.get(j).get("column"));
                            cell.setCellStyle(headStyle);
                            sheet.setDefaultColumnStyle(j, bodyStyle);
                        } else {
                            Word word = words.get(i);
                            switch (j) {
                                case 0:
                                    cell.setCellValue(word.getEng());
                                    break;
                                case 1:
                                    cell.setCellValue(word.getKor());
                                    break;
                                default: break;
                            }
                        }
                    }
                }
            }
            response.setContentType("ms-vnd/excel");
            response.setHeader("Content-Disposition", "attachment;filename=word-upload-format.xlsx");

            workbook.write(response.getOutputStream());
            workbook.close();
        } catch (IOException | IndexOutOfBoundsException e) {
            response.sendError(HttpStatus.BAD_REQUEST.value());
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpStatus.NOT_FOUND.value());
        }
    }

    @Transactional
    public ExcelResponse uploadExcel(@NonNull MultipartFile excel) {
        try {
            if (excel.getOriginalFilename() != null && (excel.getOriginalFilename().endsWith(".xlsx") || excel.getOriginalFilename().endsWith("xls"))) {
                Workbook workbook;
                try {
                    workbook = new XSSFWorkbook(excel.getInputStream());
                } catch (OfficeXmlFileException e) {
                    workbook = new HSSFWorkbook(excel.getInputStream());
                }
                Sheet sheet = workbook.getSheetAt(0);

                List<Paragraph> nodes = new LinkedList<>();
                for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                    Row row = sheet.getRow(i);
                    String eng = row.getCell(0).getStringCellValue(),
                            kor = row.getCell(1).getStringCellValue();

                    if (eng != null && !"".equals(eng) && kor != null && !"".equals(kor)) {
                        CoreLabel label = lemmatizer.getCoreLabel(eng);
                        nodes.add(new Paragraph(label.lemma(), kor, label.tag()));
                    }
                }

                return new ExcelResponse(200, nodes);
            } else throw new IndexOutOfBoundsException("지원하지 않는 파일 형식입니다.");
        } catch (IndexOutOfBoundsException e) {
            return new ExcelResponse(3000);
        } catch (Exception e) {
            e.printStackTrace();
            return new ExcelResponse(500);
        }
    }

    private CellStyle headerStyles(@NonNull Workbook workbook) {
        CellStyle headStyle = workbook.createCellStyle();
        headStyle.setLocked(true);
        headStyle.setBorderTop(BorderStyle.THIN);
        headStyle.setBorderBottom(BorderStyle.THIN);
        headStyle.setBorderLeft(BorderStyle.THIN);
        headStyle.setBorderRight(BorderStyle.THIN);
        headStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.GREEN.getIndex());
        headStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headStyle.setAlignment(HorizontalAlignment.CENTER);
        return headStyle;
    }

    private CellStyle bodyStyle(Workbook workbook)
    {
        CellStyle bodyStyle = workbook.createCellStyle();
        bodyStyle.setBorderTop(BorderStyle.THIN);
        bodyStyle.setBorderBottom(BorderStyle.THIN);
        bodyStyle.setBorderLeft(BorderStyle.THIN);
        bodyStyle.setBorderRight(BorderStyle.THIN);
        bodyStyle.setAlignment(HorizontalAlignment.CENTER);
        return bodyStyle;
    }
}
