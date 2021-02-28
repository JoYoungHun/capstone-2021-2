package r.demo.graphql.domain.content;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import r.demo.graphql.domain.category.Category;
import r.demo.graphql.domain.sentence.Sentence;
import r.demo.graphql.domain.user.UserInfo;
import r.demo.graphql.domain.word.Word;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
@Entity
@Table(schema = "demo", name = "content")
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "ref", columnDefinition = "TEXT", nullable = false)
    private String ref;

    @Column(name = "captions", columnDefinition = "LONGTEXT", nullable = false)
    private String captions;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "registerer", referencedColumnName = "id")
    private UserInfo registerer;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created", nullable = false)
    private java.util.Date created;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified", nullable = false)
    private java.util.Date modified;

    @ManyToMany(
            fetch = FetchType.EAGER,
            cascade = { CascadeType.DETACH })
    @JoinTable(name = "category_contents",
            joinColumns = @JoinColumn(name = "contents_idx", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "category_idx", referencedColumnName = "id"))
    private Set<Category> category = new HashSet<>();

    @OneToMany(
            fetch = FetchType.EAGER,
            cascade = { CascadeType.PERSIST },
            orphanRemoval = true,
            mappedBy = "content")
    private Set<Word> words;

    @OneToMany(
            fetch = FetchType.EAGER,
            cascade = { CascadeType.PERSIST },
            orphanRemoval = true,
            mappedBy = "content")
    private Set<Sentence> sentences;

    @Builder
    public Content(String title, String ref, String captions, UserInfo user, Set<Category> categories) {
        this.title = title;
        this.ref = ref;
        this.captions = captions;
        this.registerer = user;
        this.category.addAll(categories);
    }

    public void addCategory(@NonNull Category category) {
        if (this.category.stream().noneMatch(ctg -> ctg.getId() == category.getId()))
            this.category.add(category);
    }

    public void filterCategory(@NonNull Category filter) {
        this.category = this.category.stream().filter(ctg -> ctg.getId() != filter.getId()).collect(Collectors.toSet());
    }
}
