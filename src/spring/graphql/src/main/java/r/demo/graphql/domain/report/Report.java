package r.demo.graphql.domain.report;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import r.demo.graphql.domain.content.Content;
import r.demo.graphql.domain.user.UserInfo;

import javax.persistence.*;
import java.util.Date;

@Getter
@NoArgsConstructor
@Entity
@Table(schema = "demo", name = "report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "content", referencedColumnName = "id")
    private Content content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user", referencedColumnName = "id")
    private UserInfo user;

    @Column(name = "wordLen", columnDefinition = "INT", nullable = false)
    private int wordLen = 0;

    @Column(name = "sentenceLen", columnDefinition = "INT", nullable = false)
    private int sentenceLen = 0;

    @Column(name = "correctWordsLev1", columnDefinition = "MEDIUMINT", nullable = false)
    private int correctWordsLev1 = 0;

    @Column(name = "correctWordsLev2", columnDefinition = "MEDIUMINT", nullable = false)
    private int correctWordsLev2 = 0;

    @Column(name = "correctWordsLev3", columnDefinition = "MEDIUMINT", nullable = false)
    private int correctWordsLev3 = 0;

    @Column(name = "correctSentencesLev1", columnDefinition = "MEDIUMINT", nullable = false)
    private int correctSentencesLev1 = 0;

    @Column(name = "correctSentencesLev2", columnDefinition = "MEDIUMINT", nullable = false)
    private int correctSentencesLev2 = 0;

    @Column(name = "passWordLev1", columnDefinition = "TINYINT")
    private boolean passWordLev1 = false;

    @Column(name = "passWordLev2", columnDefinition = "TINYINT")
    private boolean passWordLev2 = false;

    @Column(name = "passWordLev3", columnDefinition = "TINYINT")
    private boolean passWordLev3 = false;

    @Column(name = "passSentenceLev1", columnDefinition = "TINYINT")
    private boolean passSentenceLev1 = false;

    @Column(name = "passSentenceLev2", columnDefinition = "TINYINT")
    private boolean passSentenceLev2 = false;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created", nullable = false)
    private Date created;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified", nullable = false)
    private Date modified;

    @Builder
    public Report(Content content, UserInfo user, int wordLen, int sentenceLen) {
        this.content = content;
        this.user = user;
        this.wordLen = wordLen;
        this.sentenceLen = sentenceLen;
    }

    public void toggleWordPassLev1() {
        this.passWordLev1 = true;
    }

    public void toggleWordPassLev2() {
        this.passWordLev2 = true;
    }

    public void toggleWordPassLev3() {
        this.passWordLev3 = true;
    }

    public void toggleSentencePassLev1() {
        this.passSentenceLev1 = true;
    }

    public void toggleSentencePassLev2() {
        this.passSentenceLev2 = true;
    }

    public void setCorrectWordsLev1(int correct) {
        this.correctWordsLev1 = correct;
    }

    public void setCorrectWordsLev2(int correct) {
        this.correctWordsLev2 = correct;
    }

    public void setCorrectWordsLev3(int correct) {
        this.correctWordsLev3 = correct;
    }

    public void setCorrectSentencesLev1(int correct) {
        this.correctSentencesLev1 = correct;
    }

    public void setCorrectSentencesLev2(int correct) {
        this.correctSentencesLev2 = correct;
    }
}
