package r.demo.graphql.response;

import lombok.Getter;
import r.demo.graphql.domain.report.Report;

@Getter
public class TrophyResponse {
    private final long content;
    private boolean wordLev1;
    private boolean wordLev2 = false;
    private boolean wordLev3 = false;
    private boolean sentenceLev1 = false;
    private boolean sentenceLev2 = false;

    public TrophyResponse(long content, Report report) {
        this.content = content;
        this.wordLev1 = report.isPassWordLev1();
        this.wordLev2 = report.isPassWordLev2();
        this.wordLev3 = report.isPassWordLev3();
        this.sentenceLev1 = report.isPassSentenceLev1();
        this.sentenceLev2 = report.isPassSentenceLev2();
    }

    public TrophyResponse(long content) {
        this.content = content;
    }
}
