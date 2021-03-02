package r.demo.graphql.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import r.demo.graphql.domain.files.FileInfo;
import r.demo.graphql.domain.files.FileInfoRepo;
import r.demo.graphql.response.FileResponse;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URL;
import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

@Service
public class FileService {
    @Value("${aws.bucket}") private String bucket;
    private final FileInfoRepo fileRepo;
    private final S3Client s3Client;

    public FileService(FileInfoRepo fileRepo, S3Client s3Client) {
        this.fileRepo = fileRepo;
        this.s3Client = s3Client;
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
}
