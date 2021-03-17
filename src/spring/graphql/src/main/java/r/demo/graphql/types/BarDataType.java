package r.demo.graphql.types;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BarDataType {
    private String country;
    private float level1;
    private final String level1Color = "hsl(110, 70%, 50%)";
    private float level2;
    private final String level2Color = "hsl(54, 70%, 50%)";
    private float level3;
    private final String level3Color = "hsl(340, 70%, 50%)";
    private float objective;
    private final String objectiveColor = "hsl(192, 70%, 50%)";
    private float subjective;
    private final String subjectiveColor = "hsl(238, 70%, 50%)";

    @Builder
    public BarDataType(String label, float level1, float level2, float level3, float objective, float subjective) {
        this.country = label;
        this.level1 = level1;
        this.level2 = level2;
        this.level3 = level3;
        this.objective = objective;
        this.subjective = subjective;
    }
}
