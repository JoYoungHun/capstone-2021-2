package r.demo.graphql.types;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class Document {
    private final List<String> split;
    private final List<String> pos;

    public Document(@org.springframework.lang.NonNull List<String> split, @org.springframework.lang.NonNull List<String> pos) {
        this.split = split;
        this.pos = pos;
    }
}
