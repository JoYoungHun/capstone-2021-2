package r.demo.graphql.response;

import lombok.Getter;

@Getter
public class FileResponse {
    private final int status;
    private long fileId;
    private String path;

    public FileResponse(int status) {
        this.status = status;
    }

    public FileResponse(int status, long fileId, String path) {
        this.status = status;
        this.fileId = fileId;
        this.path = path;
    }
}
