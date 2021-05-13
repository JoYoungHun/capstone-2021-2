package r.demo.graphql.response;

import lombok.Getter;
import r.demo.graphql.types.Bubble;

import java.util.List;

@Getter
public class BubbleResponse {
    private final List<Bubble> bubbles;
    private final int totalPages;

    public BubbleResponse(List<Bubble> bubbles, int totalPages) {
        this.bubbles = bubbles;
        this.totalPages = totalPages;
    }
}
