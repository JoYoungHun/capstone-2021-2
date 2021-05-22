package r.demo.graphql.types;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PieDataType {
    private String id;
    private String label;
    private float value;
    private String color;

    @Builder
    public PieDataType(String id, String label, float value, String color) {
        this.id = id;
        this.label = label;
        this.value = value;
        this.color = color;
    }
}
