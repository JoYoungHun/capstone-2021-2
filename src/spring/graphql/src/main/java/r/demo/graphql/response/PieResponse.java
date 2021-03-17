package r.demo.graphql.response;

import lombok.Getter;
import r.demo.graphql.types.PieDataType;

import java.util.List;

@Getter
public class PieResponse {
    private final int status;
    private List<PieDataType> data = null;

    public PieResponse(int status) {
        this.status = status;
    }

    public PieResponse(int status, List<PieDataType> data) {
        this.status = status;
        this.data = data;
    }
}
