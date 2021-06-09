package r.demo.graphql.domain.viewed;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import r.demo.graphql.domain.content.Content;
import r.demo.graphql.domain.user.UserInfo;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
@Table(schema = "demo", name = "viewed")
public class Viewed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user", referencedColumnName = "id")
    private UserInfo user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "content", referencedColumnName = "id")
    private Content content;

    @Column(name = "views", columnDefinition = "INT")
    private long views;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created", nullable = false)
    private java.util.Date created;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified", nullable = false)
    private java.util.Date modified;

    @Builder
    public Viewed(UserInfo user, Content content, long views) {
        this.user = user;
        this.content = content;
        this.views = views;
    }

    public void setViews(long views) {
        this.views = views;
    }
}
