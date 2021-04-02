package r.demo.graphql.core;

import com.sun.istack.NotNull;
import com.sun.istack.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import r.demo.graphql.response.ExcelResponse;
import r.demo.graphql.response.FileResponse;
import r.demo.graphql.utils.FileService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class FileController {
    private final FileService service;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER', 'ROLE_READONLY')")
    @PostMapping(value = "/upload", produces = "application/json")
    public FileResponse upload(@NotNull MultipartFile file) {
        return service.upload(file);
    }

    @GetMapping(value = "/excel/format", produces = "ms-vnd/excel")
    public void downloadExcelFormat(HttpServletResponse response, @Nullable @RequestParam(name = "contents", required = false) Long contentsKey) {
        try {
            service.downloadExcelFormat(response, contentsKey);
        } catch (IOException e) {
            response.setStatus(500);
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    @PostMapping(value = "/excel/upload", produces = "application/json")
    public ExcelResponse uploadExcel(@NotNull MultipartFile excel) {
        return service.uploadExcel(excel);
    }
}
