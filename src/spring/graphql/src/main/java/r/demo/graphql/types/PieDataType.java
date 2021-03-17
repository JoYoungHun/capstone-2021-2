package r.demo.graphql.types;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChartDataType {
    private String id;
    private String label;
    private float value;
    private String color;
}
