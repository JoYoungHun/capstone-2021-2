package r.demo.graphql.domain.content;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import r.demo.graphql.domain.category.Category;

@Repository
public interface ContentRepo extends CrudRepository<Content, Long> {
    Page<Content> findAll(Pageable pageable);
    Page<Content> findAllByCategory(Category category, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = "SET SQL_SAFE_UPDATES = 0;", nativeQuery = true)
    void updateSQLMode();
}
