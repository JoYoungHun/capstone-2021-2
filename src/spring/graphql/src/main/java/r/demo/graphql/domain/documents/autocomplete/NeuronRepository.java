package r.demo.graphql.domain.documents.autocomplete;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.Optional;

public interface NeuronRepository extends ElasticsearchRepository<Neuron, String> {
    Optional<Neuron> findByUserAndWord(long user, String word);
    List<Neuron> findAllByUserAndSynapseContains(long user, String keyword);
}
