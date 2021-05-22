package r.demo.graphql.types;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

import java.util.List;

@Getter
public class SummaryShell {
    private final String originalText;
    private final String translatedKor;
    private final List<SummaryToken> tokens;

    @Builder
    public SummaryShell(@NonNull String originalText, @NonNull String translatedKor, @NonNull List<SummaryToken> tokens) {
        this.originalText = originalText;
        this.translatedKor = translatedKor;
        this.tokens = tokens;
    }
}
