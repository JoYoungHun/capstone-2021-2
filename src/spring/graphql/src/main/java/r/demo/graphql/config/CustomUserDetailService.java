package r.demo.graphql.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import r.demo.graphql.domain.user.UserInfo;
import r.demo.graphql.domain.user.UserInfoRepo;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

@Component
public class CustomUserDetailService implements UserDetailsService {
    private final UserInfoRepo userRepo;

    public CustomUserDetailService(UserInfoRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) {
        try {
            Optional<UserInfo> user = userRepo.findByEmail(username);
            return new User(username, user.map(UserInfo::getPassword).orElse(null), authorities(user.map(UserInfo::getAuthority).orElse(null)));
        } catch (NullPointerException e) {
            return null;
        }
    }

    public Collection<? extends GrantedAuthority> authorities(String authority) {
        return Collections.singletonList(new SimpleGrantedAuthority(authority));
    }
}
