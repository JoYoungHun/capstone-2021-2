package r.demo.graphql.types;

import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashMap;

@Getter
@Setter
public class Paragraph {
    private String eng;
    private String kor;
    private String pos;

    public Paragraph(String eng, String kor, String pos) {
        this.eng = eng;
        this.kor = kor;
        this.pos = pos;
    }

    public Paragraph(LinkedHashMap<String, String> lhm) {
        this.eng = lhm.get("eng");
        this.kor = lhm.get("kor");
        if (lhm.get("pos") != null) this.pos = lhm.get("pos");
    }
}
