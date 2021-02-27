package r.demo.graphql.response;

import lombok.Getter;

@Getter
public class DefaultResponse {
    private final int status;
    private String message;

    public DefaultResponse(int status) {
        this.status = status;
    }

    public DefaultResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
