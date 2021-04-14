package r.demo.graphql.domain.word;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import r.demo.graphql.domain.content.Content;

import java.util.List;
import java.util.Optional;

@Repository
public interface WordRepo extends JpaRepository<Word, Long> {
    List<Word> findAllByContentOrderBySequence(Content content);
    @Query(value = "select * from word w where w.eng = ?1 order by w.modified desc limit 1", nativeQuery = true)
    Optional<Word> findLatestKorMeaning(String eng);
    @Query(value = "select * from word w where w.content = ?1 and w.lemma = ?2 and w.eng = ?3 order by w.modified desc limit 1", nativeQuery = true)
    Optional<Word> getMatchedLatestWord(Content content, String lemma, String eng);

    @Query(value = "select * from word w where w.id != ?1 and w.eng != ?2 and w.lemma != ?2 order by rand() limit 3", nativeQuery = true)
    List<Word> getRandWords(long id, String eng);

    @Query(value = "select * from word w where w.content = ?1 order by rand()", nativeQuery = true)
    List<Word> getAllWordsByRandOrdered(Content content);

    @Transactional
    @Modifying
    @Query(value = "update word w set w.content = null where w.content = ?1", nativeQuery = true)
    void disconnectWithParent(Content content);
}
