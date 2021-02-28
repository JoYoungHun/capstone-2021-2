package r.demo.graphql.domain.category;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import r.demo.graphql.domain.content.Content;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@NoArgsConstructor
@Entity
@Table(schema = "demo", name = "category")
@ToString
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created", nullable = false)
    private Date created;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified", nullable = false)
    private Date modified;

    @ManyToMany(
            fetch = FetchType.EAGER,
            mappedBy = "category")
    private final Set<Content> content = new HashSet<>();

    @Builder
    public Category(String name) {
        this.name = name;
    }

    public void setName(@NonNull String name) {
        this.name = name;
    }

    public void setContent(@NonNull Set<Content> contents) {
        this.content.clear();
        this.content.addAll(contents);
    }
}
