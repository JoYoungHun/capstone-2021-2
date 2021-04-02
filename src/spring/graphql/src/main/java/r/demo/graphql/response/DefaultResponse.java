package r.demo.graphql.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

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

    public DefaultResponse(HttpStatus httpStatus) {
        this.status = httpStatus.value();
        this.message = httpStatus.getReasonPhrase();
    }
}
