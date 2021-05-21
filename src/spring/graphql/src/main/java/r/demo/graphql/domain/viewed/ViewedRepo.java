package r.demo.graphql.domain.viewed;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import r.demo.graphql.domain.content.Content;
import r.demo.graphql.domain.user.UserInfo;

import java.util.Optional;

@Repository
public interface ViewedRepo extends PagingAndSortingRepository<Viewed, Long> {
    Optional<Viewed> findByUserAndContent(UserInfo user, Content content);
    Page<Viewed> findAllByUser(UserInfo user, Pageable pageable);
}
