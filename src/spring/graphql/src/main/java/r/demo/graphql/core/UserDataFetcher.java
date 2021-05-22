package r.demo.graphql.core;

import graphql.schema.DataFetcher;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import r.demo.graphql.annotation.Gql;
import r.demo.graphql.annotation.GqlDataFetcher;
import r.demo.graphql.annotation.GqlType;
import r.demo.graphql.config.JwtTokenProvider;
import r.demo.graphql.domain.content.Content;
import r.demo.graphql.domain.content.ContentRepo;
import r.demo.graphql.domain.files.FileInfoRepo;
import r.demo.graphql.domain.user.UserInfo;
import r.demo.graphql.domain.user.UserInfoRepo;
import r.demo.graphql.response.DefaultResponse;
import r.demo.graphql.response.Token;
import r.demo.graphql.utils.InternalFilterChains;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;

@Gql
@Service
public class UserDataFetcher {
    private final PasswordEncoder encoder;
    private final UserInfoRepo userRepo;
    private final FileInfoRepo fileRepo;
    private final ContentRepo contentRepo;
    private final JwtTokenProvider jwtTokenProvider;
    private final InternalFilterChains chains;
    private final List<String> authorities = Arrays.asList("ROLE_ADMIN", "ROLE_USER", "ROLE_READONLY");

    public UserDataFetcher(PasswordEncoder encoder,
                           UserInfoRepo userRepo, FileInfoRepo fileRepo, ContentRepo contentRepo,
                           @Lazy JwtTokenProvider jwtTokenProvider, InternalFilterChains chains) {
        this.encoder = encoder;
        this.userRepo = userRepo;
        this.fileRepo = fileRepo;
        this.contentRepo = contentRepo;
        this.jwtTokenProvider = jwtTokenProvider;
        this.chains = chains;
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> allUsers() {
        return environment -> {
            LinkedHashMap<String, Object> lhm = new LinkedHashMap<>();
            try {
                String authority = environment.getArgument("authority");
                final LinkedHashMap<String, Object> req = environment.getArgument("pr");
                int page = Integer.parseInt(req.get("page").toString()),
                        renderItem = Integer.parseInt(req.get("renderItem").toString());
                HttpStatus isAuthenticated = chains.doFilter(Collections.singletonList("ROLE_ADMIN"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    Page<UserInfo> users;
                    if (authorities.contains(authority)) {
                        users = userRepo.findAllByAuthorityIsIn(
                                Arrays.asList(authority, "ROLE_USER".equals(authority) ? "ROLE_READONLY" : ""), PageRequest.of(page - 1, renderItem));
                    } else {
                        users = userRepo.findAll(PageRequest.of(page - 1, renderItem));
                    }

                    lhm.put("users", users);
                    lhm.put("totalElements", users.getTotalElements());
                } else throw new RuntimeException();
            } catch (RuntimeException e) {
                lhm.put("users", Collections.emptyList());
                lhm.put("totalElements", 0L);
            }
            return lhm;
        };
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> myInfo() {
        return environment -> {
            try {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                return userRepo.findByEmail(email).orElseThrow(IllegalArgumentException::new);
            } catch (IllegalArgumentException e) {
                return null;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        };
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
                if ("anonymousUser".equals(id) || userRepo.existsByEmail(id)) throw new RuntimeException();
                else {
                    userRepo.save(UserInfo.builder()
                            .email(id).password(encoder.encode(password)).name(name).build());
                }

                return new DefaultResponse(HttpStatus.OK);
            } catch (IllegalArgumentException e) {
                return new DefaultResponse(HttpStatus.BAD_REQUEST);
            } catch (RuntimeException e) {
                return new DefaultResponse(HttpStatus.CONFLICT);
            } catch (Exception e) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> updateUserAuthority() {
        return environment -> {
            try {
                long id = environment.getArgument("id");
                String authority = environment.getArgument("authority");
                HttpStatus isAuthenticated = chains.doFilter(Collections.singletonList("ROLE_ADMIN"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    UserInfo user = userRepo.findById(id).orElseThrow(IllegalArgumentException::new);
                    if (authorities.contains(authority)) {
                        user.setAuthority(authority);
                        userRepo.save(user);
                    } else throw new IllegalArgumentException();

                    return new DefaultResponse(HttpStatus.OK.value());
                } else return new DefaultResponse(isAuthenticated);
            } catch (IllegalArgumentException e) {
                return new DefaultResponse(HttpStatus.NOT_FOUND.value(), e.getMessage());
            } catch (Exception e) {
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> deleteUser() {
        return environment -> {
            try {
                long id = environment.getArgument("id");
                HttpStatus isAuthenticated = chains.doFilter(Collections.singletonList("ROLE_ADMIN"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    UserInfo user = userRepo.findById(id).orElseThrow(IllegalArgumentException::new);
                    List<Content> myContents = contentRepo.findAllByRegisterer(user);

                    // change content's registerer to admin account
                    // if there's no admin account in database, throw exception (unexpected)
                    // later on, report data delete logic needed to add.
                    UserInfo admin = userRepo.getFirstUserOfAuthority("ROLE_ADMIN").orElseThrow(Exception::new);
                    for (Content content : myContents)
                        content.setRegisterer(admin);

                    contentRepo.saveAll(myContents);
                    userRepo.delete(user);
                    return new DefaultResponse(HttpStatus.OK.value());
                } else return new DefaultResponse(isAuthenticated);
            } catch (IllegalArgumentException e) {
                return new DefaultResponse(HttpStatus.NOT_FOUND.value(), e.getMessage());
            } catch (Exception e) {
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> updateUserInfo() {
        return environment -> {
            try {
                LinkedHashMap<String, Object> req = environment.getArgument("input");
                long id = (long) req.get("id");
                String password = req.get("password") != null ? req.get("password").toString() : null,
                        name = req.get("name").toString();
                Integer fileId = req.get("profile") != null ? Integer.parseInt(req.get("profile").toString()) : null;
                HttpStatus isAuthenticated = chains.doFilter(Arrays.asList("ROLE_ADMIN", "ROLE_READONLY", "ROLE_USER"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    UserInfo user = userRepo.findById(id).orElseThrow(IllegalArgumentException::new);
                    if (!name.equals(user.getName()))
                        user.setName(name);
                    if (password != null)
                        user.setPassword(encoder.encode(password));
                    if (fileId != null)
                        user.setProfile(fileRepo.findById((long) fileId).orElseThrow(IllegalArgumentException::new));
                    userRepo.save(user);
                    return new DefaultResponse(HttpStatus.OK.value());
                } else return new DefaultResponse(isAuthenticated);
            } catch (RuntimeException e) {
                return new DefaultResponse(HttpStatus.NOT_FOUND.value(), e.getMessage());
            } catch (Exception e) {
                e.printStackTrace();
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
            }
        };
    }
}
