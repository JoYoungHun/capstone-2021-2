package r.demo.graphql.response;

import lombok.Getter;
import r.demo.graphql.types.Problem;

import java.util.List;

@Getter
public class ProblemResponse {
    private final int status;
    private List<Problem> problems;

    public ProblemResponse(int status) {
        this.status = status;
    }

    public ProblemResponse(int status, List<Problem> problems) {
        this.status = status;
        this.problems = problems;
    }
}
