package kr.dove.spider.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends ElasticsearchRepository<Video, String> {
    Page<Video> findAll(Pageable pageable);
    List<Video> findAllByCaptionsContainsOrTitleContains(String kw1, String kw2);
    List<Video> findAllByTitleContains(String keyword);
}
