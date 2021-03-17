package r.demo.graphql.response;

import lombok.Getter;
import r.demo.graphql.types.RadarDataType;

import java.util.List;

@Getter
public class RadarResponse {
    private final int status;
    private List<RadarDataType> data = null;

    public RadarResponse(int status) {
        this.status = status;
    }

    public RadarResponse(int status, List<RadarDataType> data) {
        this.status = status;
        this.data = data;
    }
}
