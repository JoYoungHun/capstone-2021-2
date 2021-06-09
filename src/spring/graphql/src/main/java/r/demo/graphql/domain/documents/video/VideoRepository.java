package r.demo.graphql.domain.documents.video;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface VideoRepository extends ElasticsearchRepository<Video, String> {
    Page<Video> findAllByCreatedBetween(Date from1, Date from2, Pageable pageable);
    Page<Video> findAllByCaptionsInOrTitleIn(String kw1, String kw2, Pageable pageable);
    Page<Video> findAllByCaptionsInAndCreatedBetweenOrTitleInAndCreatedBetween(String kw1, Date from1, Date from2,
                                                                                           String kw2, Date from3, Date from4, Pageable pageable);
    Page<Video> findAllByIdIsNotIn(List<String> ids,Pageable pageable);
    Page<Video> findAllByIdIsIn(List<String> ids, Pageable pageable);
}
