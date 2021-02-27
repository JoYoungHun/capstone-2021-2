package r.demo.graphql.domain.word;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import r.demo.graphql.domain.content.Content;

import java.util.Optional;

@Repository
public interface WordRepo extends JpaRepository<Word, Long> {
    @Query(value = "select * from word w where w.eng = ?1 order by w.modified desc limit 1", nativeQuery = true)
    Optional<Word> findLatestKorMeaning(String eng);

    @Transactional
    @Modifying
    @Query(value = "update word w set w.content = null where w.content = ?1", nativeQuery = true)
    void disconnectWithParent(Content content);
}
