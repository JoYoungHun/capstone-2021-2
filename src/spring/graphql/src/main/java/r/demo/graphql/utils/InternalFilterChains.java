package r.demo.graphql.utils;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class InternalFilterChains {
    public HttpStatus doFilter(List<String> acceptable) {
        try {
            Collection<?> requested = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
            if (!requested.isEmpty()) {
                // Object: SimpleGrantedAuthority
                for (Object a : requested) {
                    if (a.toString().equals("ROLE_ANONYMOUS")) throw new RuntimeException();
                    else if (acceptable.contains(a.toString()))
                        return HttpStatus.OK;
                }
                return HttpStatus.NOT_ACCEPTABLE;
            } else throw new RuntimeException();
        } catch (RuntimeException e) {
            return HttpStatus.UNAUTHORIZED;
        }
    }
}
