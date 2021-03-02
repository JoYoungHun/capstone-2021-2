package r.demo.graphql.core;

import com.sun.istack.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import r.demo.graphql.response.FileResponse;
import r.demo.graphql.utils.FileService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class FileController {
    private final FileService service;

    @PostMapping(value = "/upload", produces = "application/json")
    public FileResponse upload(@NotNull MultipartFile file) {
        return service.upload(file);
    }
}
