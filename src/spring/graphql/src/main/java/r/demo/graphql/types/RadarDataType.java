package r.demo.graphql.types;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RadarDataType {
    private String taste;
    private int total;
    private float correct;

    @Builder
    public RadarDataType(String taste, int total, float correct) {
        this.taste = taste;
        this.total = total;
        this.correct = correct;
    }
}
