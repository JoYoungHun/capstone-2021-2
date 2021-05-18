package r.demo.graphql.response;

import lombok.Getter;
import r.demo.graphql.types.Link;
import r.demo.graphql.types.Node;

import java.util.List;

@Getter
public class Synapse {
    private final List<Node> points;
    private final List<Link> links;

    public Synapse(List<Node> nodes, List<Link> links) {
        this.points = nodes;
        this.links = links;
    }
}
