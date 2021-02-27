package r.demo.graphql.core;

import graphql.schema.DataFetcher;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import r.demo.graphql.annotation.Gql;
import r.demo.graphql.annotation.GqlDataFetcher;
import r.demo.graphql.annotation.GqlType;
import r.demo.graphql.config.JwtTokenProvider;
import r.demo.graphql.domain.user.UserInfo;
import r.demo.graphql.domain.user.UserInfoRepo;
import r.demo.graphql.response.Token;

@Gql
@Service
public class UserDataFetcher {
    private final PasswordEncoder encoder;
    private final UserInfoRepo userRepo;
    private final JwtTokenProvider jwtTokenProvider;

    public UserDataFetcher(PasswordEncoder encoder, UserInfoRepo userRepo,
                           @Lazy JwtTokenProvider jwtTokenProvider) {
        this.encoder = encoder;
        this.userRepo = userRepo;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> allUsers() {
        return environment -> userRepo.findAll();
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> user() {
        return environment -> {
            String id = SecurityContextHolder.getContext().getAuthentication().getName();
            return userRepo.findByEmail(id);
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> login() {
        return environment -> {
            int status;
            String token = null;
            try {
                // for loading effects
                Thread.sleep(1500);
                String id = environment.getArgument("id"), pwd = environment.getArgument("password");
                UserInfo user = userRepo.findByEmail(id).orElseThrow(NullPointerException::new);

                if (encoder.matches(pwd, user.getPassword())) {
                    status = HttpStatus.OK.value();
                    token = jwtTokenProvider.createToken(user.getEmail());
                } else status = HttpStatus.NOT_FOUND.value();
            } catch (IllegalArgumentException e) {
                status = HttpStatus.BAD_REQUEST.value();
            } catch (NullPointerException e) {
                status = HttpStatus.NOT_FOUND.value();
            }
            return new Token(status, token);
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> sign() {
        return environment -> {
            try {
                // for loading effects
                Thread.sleep(1500);
                String id = environment.getArgument("id"),
                        password = environment.getArgument("password"),
                        name = environment.getArgument("name");
                if (userRepo.existsByEmail(id)) throw new RuntimeException();
                else {
                    userRepo.save(UserInfo.builder()
                            .email(id).password(encoder.encode(password)).name(name).build());
                }

                return HttpStatus.OK.value();
            } catch (IllegalArgumentException e) {
                return HttpStatus.BAD_REQUEST.value();
            } catch (RuntimeException e) {
                return HttpStatus.CONFLICT.value();
            } catch (Exception e) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return HttpStatus.INTERNAL_SERVER_ERROR.value();
            }
        };
    }
}
