package r.demo.graphql.types;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

import javax.annotation.Nullable;

@Getter
public class SummaryToken {
    private final String eng;
    private final String kor;
    private final String pos;
    private final boolean highlight;

    @Builder
    public SummaryToken(@NonNull String eng, @NonNull String kor, @Nullable String pos, boolean highlight) {
        this.eng = eng;
        this.kor = kor;
        this.pos = pos == null ? "" : pos;
        this.highlight = highlight;
    }
}
