package r.demo.graphql.domain.report;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import r.demo.graphql.domain.content.Content;
import r.demo.graphql.domain.user.UserInfo;

import java.util.Optional;

@Repository
public interface ReportRepo extends PagingAndSortingRepository<Report, Long> {
    Optional<Report> findByContentAndUser(Content content, UserInfo user);
}
