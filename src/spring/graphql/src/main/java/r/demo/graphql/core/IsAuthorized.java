package r.demo.graphql.core;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import r.demo.graphql.utils.InternalFilterChains;

import java.util.Collections;

@RestController
@RequiredArgsConstructor
@RequestMapping("/authorized")
public class IsAuthorized {
    private final InternalFilterChains chains;

    @GetMapping(value = "/check")
    public ResponseEntity<Object> authorized() {
        return new ResponseEntity<>(chains.doFilter(Collections.singletonList("ROLE_ADMIN")).value(), HttpStatus.OK);
    }
}
