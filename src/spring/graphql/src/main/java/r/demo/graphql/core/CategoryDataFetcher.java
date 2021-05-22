package r.demo.graphql.core;

import graphql.schema.DataFetcher;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import r.demo.graphql.annotation.Gql;
import r.demo.graphql.annotation.GqlDataFetcher;
import r.demo.graphql.annotation.GqlType;
import r.demo.graphql.domain.category.Category;
import r.demo.graphql.domain.category.CategoryRepo;
import r.demo.graphql.domain.content.Content;
import r.demo.graphql.response.DefaultResponse;
import r.demo.graphql.utils.InternalFilterChains;

import java.util.Collections;
import java.util.Set;

@Gql
@Service
public class CategoryDataFetcher {
    private final ContentDataFetcher contentDataFetcher;
    private final InternalFilterChains chains;
    private final CategoryRepo categoryRepo;

    public CategoryDataFetcher(@Lazy ContentDataFetcher contentDataFetcher,
                               InternalFilterChains chains, CategoryRepo categoryRepo) {
        this.contentDataFetcher = contentDataFetcher;
        this.chains = chains;
        this.categoryRepo = categoryRepo;
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> categories() {
        return environment -> categoryRepo.findAll();
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> category() {
        return environment -> {
            try {
                long categoryKey = Long.parseLong(environment.getArgument("id").toString());
                return categoryRepo.findById(categoryKey).orElseThrow(IllegalArgumentException::new);
            } catch (IllegalArgumentException e) {
                return null;
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> createCategory() {
        return environment -> {
            try {
                String title = environment.getArgument("title");
                HttpStatus isAuthenticated = chains.doFilter(Collections.singletonList("ROLE_ADMIN"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    if (categoryRepo.existsByName(title)) throw new RuntimeException();
                    else categoryRepo.save(Category.builder().name(title).build());
                }

                return new DefaultResponse(isAuthenticated);
            } catch (RuntimeException e) {
                return new DefaultResponse(HttpStatus.CONFLICT);
            } catch (Exception e) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> updateCategory() {
        return environment -> {
            try {
                String title = environment.getArgument("title");
                long id = Long.parseLong(environment.getArgument("id").toString());
                HttpStatus isAuthenticated = chains.doFilter(Collections.singletonList("ROLE_ADMIN"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    Category category = categoryRepo.findById(id).orElseThrow(IndexOutOfBoundsException::new);
                    if (!title.equals(category.getName()))
                        category.setName(title);
                    categoryRepo.save(category);
                }

                return new DefaultResponse(isAuthenticated);
            } catch (IndexOutOfBoundsException e) {
                return new DefaultResponse(HttpStatus.NOT_FOUND);
            } catch (RuntimeException e) {
                return new DefaultResponse(HttpStatus.CONFLICT);
            } catch (Exception e) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return new DefaultResponse(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> deleteCategory() {
        return environment -> {
            try {
                long id = Long.parseLong(environment.getArgument("id").toString());
                HttpStatus isAuthenticated = chains.doFilter(Collections.singletonList("ROLE_ADMIN"));
                if (isAuthenticated.equals(HttpStatus.OK)) {
                    Category category = categoryRepo.findById(id).orElseThrow(IndexOutOfBoundsException::new);
                    Set<Content> contents = category.getContent();
                    // call del function from other service
                    for (Content content : contents) {
                        if (contentDataFetcher.deleteContentDetails(content.getId()))
                            throw new RuntimeException();
                    }
                    categoryRepo.delete(category);
                }

                return new DefaultResponse(isAuthenticated);
            } catch (IndexOutOfBoundsException e) {
                return new DefaultResponse(HttpStatus.NOT_FOUND);
            } catch (RuntimeException e) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return new DefaultResponse(HttpStatus.CONFLICT);
            } catch (Exception e) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return HttpStatus.INTERNAL_SERVER_ERROR.value();
            }
        };
    }
}
