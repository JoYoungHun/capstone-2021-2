package r.demo.graphql.types;

import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashMap;

@Getter
@Setter
public class Paragraph {
    private String eng;
    private String kor;

    public Paragraph(String eng, String kor) {
        this.eng = eng;
        this.kor = kor;
    }

    public Paragraph(LinkedHashMap<String, String> lhm) {
        this.eng = lhm.get("eng");
        this.kor = lhm.get("kor");
    }
}
