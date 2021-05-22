package r.demo.graphql.types;

import lombok.Getter;

@Getter
public class Link {
    private final String source;
    private final String target;

    public Link(String source, String target) {
        this.source = source;
        this.target = target;
    }
}
