package r.demo.graphql.domain.sentence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import r.demo.graphql.domain.content.Content;

import java.util.List;

@Repository
public interface SentenceRepo extends JpaRepository<Sentence, Long> {
    Page<Sentence> findAllByContent(Content content, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = "update sentence s set s.content = null where s.content = ?1", nativeQuery = true)
    void disconnectWithParent(Content content);

    @Query(value = "select * from sentence s where s.id != ?1 and s.eng != ?2 order by rand() limit 3", nativeQuery = true)
    List<Sentence> getRandSentences(long id, String eng);

    @Query(value = "select * from sentence s where s.content = ?1 order by rand()", nativeQuery = true)
    List<Sentence> getAllSentencesByRandOrdered(Content content);
}
