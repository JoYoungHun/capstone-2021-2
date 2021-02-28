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
import r.demo.graphql.domain.content.ContentRepo;

import java.util.*;

@Gql
@Service
public class CategoryDataFetcher {
    private final ContentDataFetcher contentDataFetcher;
    private final CategoryRepo categoryRepo;
    private final ContentRepo contentRepo;

    public CategoryDataFetcher(@Lazy ContentDataFetcher contentDataFetcher, CategoryRepo categoryRepo, ContentRepo contentRepo) {
        this.contentDataFetcher = contentDataFetcher;
        this.categoryRepo = categoryRepo;
        this.contentRepo = contentRepo;
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> categories() {
        return environment -> categoryRepo.findAll();
    }

    @GqlDataFetcher(type = GqlType.QUERY)
    public DataFetcher<?> category() {
        return environment -> {
            long categoryKey = Long.parseLong(environment.getArgument("id").toString());
            try {
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
                if (categoryRepo.existsByName(title)) throw new RuntimeException();
                else {
                    categoryRepo.save(Category.builder().name(title).build());
                }
                return HttpStatus.OK.value();
            } catch (RuntimeException e) {
                return HttpStatus.CONFLICT.value();
            } catch (Exception e) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return HttpStatus.INTERNAL_SERVER_ERROR.value();
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> updateCategory() {
        return environment -> {
            try {
                String title = environment.getArgument("title");
                long id = Long.parseLong(environment.getArgument("id").toString());

                Category category = categoryRepo.findById(id).orElseThrow(IndexOutOfBoundsException::new);
                if (!title.equals(category.getName()))
                    category.setName(title);
                categoryRepo.save(category);

                return HttpStatus.OK.value();
            } catch (IndexOutOfBoundsException e) {
                return HttpStatus.NOT_FOUND.value();
            } catch (RuntimeException e) {
                e.printStackTrace();
                return HttpStatus.CONFLICT.value();
            } catch (Exception e) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return HttpStatus.INTERNAL_SERVER_ERROR.value();
            }
        };
    }

    @GqlDataFetcher(type = GqlType.MUTATION)
    public DataFetcher<?> deleteCategory() {
        return environment -> {
            try {
                long id = Long.parseLong(environment.getArgument("id").toString());
                Category category = categoryRepo.findById(id).orElseThrow(IndexOutOfBoundsException::new);

                Set<Content> contents = category.getContent();
                // call del function from other service
                for (Content content : contents) {
                    if (contentDataFetcher.deleteContentDetails(content.getId()))
                        throw new RuntimeException();
                }
                categoryRepo.delete(category);

                return HttpStatus.OK.value();
            } catch (IndexOutOfBoundsException e) {
                return HttpStatus.NOT_FOUND.value();
            } catch (RuntimeException e) {
                e.printStackTrace();
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return HttpStatus.CONFLICT.value();
            } catch (Exception e) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                return HttpStatus.INTERNAL_SERVER_ERROR.value();
            }
        };
    }
}
