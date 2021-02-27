package r.demo.graphql.domain.user;

import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserInfoRepo extends CrudRepository<UserInfo, Long> {
    Boolean existsByEmail(String email);
    Optional<UserInfo> findByEmail(String email);
}
