package r.demo.graphql.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import r.demo.graphql.types.Paragraph;

import java.util.List;

@Getter
public class ParseResponse {
    private final List<Paragraph> sentences;
    private final List<Paragraph> words;

    @Builder
    public ParseResponse(@NonNull List<Paragraph> sentences, @NonNull List<Paragraph> words) {
        this.sentences = sentences;
        this.words = words;
    }
}
