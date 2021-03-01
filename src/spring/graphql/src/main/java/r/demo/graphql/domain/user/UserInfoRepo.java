package r.demo.graphql.domain.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface UserInfoRepo extends CrudRepository<UserInfo, Long> {
    Boolean existsByEmail(String email);
    Optional<UserInfo> findByEmail(String email);
    Page<UserInfo> findAll(Pageable pageable);
    Page<UserInfo> findAllByAuthorityIsIn(List<String> authority, Pageable pageable);

    @Query(value = "select * from user u where u.authority = ?1 order by u.id limit 1", nativeQuery = true)
    Optional<UserInfo> getFirstUserOfAuthority(String authority);
}
