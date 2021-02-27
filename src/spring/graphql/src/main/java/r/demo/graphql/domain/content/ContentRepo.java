package r.demo.graphql.domain.content;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentRepo extends CrudRepository<Content, Long> {
}
