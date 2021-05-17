package r.demo.graphql.domain.documents.autocomplete;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Document(indexName = "neuron")
public class Neuron {
    @Id
    private String id;
    private long user;
    @Field(type = FieldType.Keyword)
    private String word;

    @Field(type = FieldType.Text, fielddata = true)
    private Set<String> synapse;
    private Date recall;
    private long clicked = 0L;

    @Builder
    public Neuron(String id, long user, String word, Set<String> synapse, Date recall, long clicked) {
        this.id = id;
        this.user = user;
        this.word = word;
        this.synapse = synapse;
        this.recall = recall;
        this.clicked = clicked;
    }
}
