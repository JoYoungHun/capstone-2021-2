package r.demo.graphql.types;

import lombok.Getter;
import r.demo.graphql.domain.sentence.Sentence;
import r.demo.graphql.domain.word.Word;

@Getter
public class Problem {
    private final long id;
    private final String eng;
    private final String kor;

    public Problem(long id, String eng, String kor) {
        this.id = id;
        this.eng = eng;
        this.kor = kor;
    }

    public Problem(Word word) {
        this.id = word.getId();
        this.eng = word.getEng();
        this.kor = word.getKor();
    }

    public Problem(Sentence sentence) {
        this.id = sentence.getId();
        this.eng = sentence.getEng();
        this.kor = sentence.getKor();
    }
}
