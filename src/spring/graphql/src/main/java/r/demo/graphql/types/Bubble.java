package r.demo.graphql.types;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import r.demo.graphql.domain.documents.video.Video;

@Getter
@Setter
@NoArgsConstructor
public class Bubble {
    private String id;
    private String title;
    private String captions;
    private String ref;
    private String created;

    @Builder
    public Bubble(String id, String title, String captions, String created, String ref) {
        this.id = id;
        this.title = title;
        this.captions = captions;
        this.ref = ref;
        this.created = created;
    }

    public Bubble(Video v) {
        this.id = v.getId();
        this.title = v.getTitle();
        this.captions = v.getCaptions();
        this.ref = v.getRef();
        this.created = v.getCreated().toString();
    }
}
