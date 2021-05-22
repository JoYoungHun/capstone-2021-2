package r.demo.graphql.response;

import lombok.Getter;
import r.demo.graphql.types.BarDataType;

import java.util.List;

@Getter
public class BarResponse {
    private final int status;
    private List<BarDataType> data =  null;

    public BarResponse(int status) {
        this.status = status;
    }

    public BarResponse(int status, List<BarDataType> data) {
        this.status = status;
        this.data = data;
    }
}
