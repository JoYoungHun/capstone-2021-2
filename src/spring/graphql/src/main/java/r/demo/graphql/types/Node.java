package r.demo.graphql.types;

import lombok.Builder;
import lombok.Getter;
import r.demo.graphql.domain.documents.autocomplete.Neuron;

@Getter
public class Node {
    private final String id;
    private final String name;
    private final float val;

    @Builder
    public Node(String id, String name, float val) {
        this.id = id;
        this.name = name;
        this.val = val;
    }

    public Node(Neuron neuron, float weight) {
        this.id = neuron.getId();
        this.name = neuron.getWord();
        this.val = weight * 1000;
    }
}
