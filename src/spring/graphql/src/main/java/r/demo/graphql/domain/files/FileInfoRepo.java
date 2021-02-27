package r.demo.graphql.domain.files;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileInfoRepo extends CrudRepository<FileInfo, Long> {

}
