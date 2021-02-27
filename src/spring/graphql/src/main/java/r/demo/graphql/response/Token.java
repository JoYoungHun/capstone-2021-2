package r.demo.graphql.response;

import lombok.Getter;

@Getter
public class Token {
    private final int status;
    private final String token;

    public Token(int status, String token) {
        this.status = status;
        this.token = token;
    }
}
