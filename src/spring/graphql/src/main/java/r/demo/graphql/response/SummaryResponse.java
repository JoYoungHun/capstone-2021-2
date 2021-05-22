package r.demo.graphql.response;

import lombok.Getter;
import lombok.NonNull;
import r.demo.graphql.types.SummaryShell;

import java.util.List;

@Getter
public class SummaryResponse {
    private final List<SummaryShell> shells;
    private final int totalPages;

    public SummaryResponse(@NonNull List<SummaryShell> shells, int totalPages) {
        this.shells = shells;
        this.totalPages = totalPages;
    }
}
