package r.demo.graphql.response;

import lombok.Getter;
import r.demo.graphql.types.Paragraph;

import java.util.Collections;
import java.util.List;

@Getter
public class ExcelResponse {
    private final int status;
    private final List<Paragraph> paragraphs;

    public ExcelResponse(int status) {
        this.status = status;
        this.paragraphs = Collections.emptyList();
    }

    public ExcelResponse(int status, List<Paragraph> paragraphs) {
        this.status = status;
        this.paragraphs = paragraphs;
    }
}
