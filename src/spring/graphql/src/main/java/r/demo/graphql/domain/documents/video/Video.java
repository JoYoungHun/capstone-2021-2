package r.demo.graphql.domain.documents.video;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.Date;

@Getter
@NoArgsConstructor
@ToString
@Document(indexName = "video")
public class Video {
    @Id
    private String id;
    @Field(type = FieldType.Text, fielddata = true)
    private String title;

    @Field(type = FieldType.Text, fielddata = true)
    private String captions;
    private String ref;

    @Field(type = FieldType.Date)
    private Date created;

    @Builder
    public Video(String id, String title, String captions, String ref, Date created) {
        this.id = id;
        this.title = title;
        this.captions = captions;
        this.ref = ref;
        this.created = created;
    }
}
