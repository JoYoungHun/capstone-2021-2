package r.demo.graphql.domain.sentence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import r.demo.graphql.domain.content.Content;

@Repository
public interface SentenceRepo extends JpaRepository<Sentence, Long> {
    @Transactional
    @Modifying
    @Query(value = "update sentence s set s.content = null where s.content = ?1", nativeQuery = true)
    void disconnectWithParent(Content content);
}
