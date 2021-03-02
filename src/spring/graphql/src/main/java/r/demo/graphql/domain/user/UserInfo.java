package r.demo.graphql.domain.user;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import r.demo.graphql.domain.files.FileInfo;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(schema = "demo", name = "user")
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "authority", nullable = false, length = 30)
    private String authority;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "profile", referencedColumnName = "id")
    private FileInfo profile;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created", nullable = false)
    private Date created;

    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modified", nullable = false)
    private Date modified;

    @Builder
    public UserInfo(String email, String password, String name, FileInfo file) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.authority = "ROLE_USER";
        this.profile = file;
    }
}
