package r.demo.graphql.config;

import graphql.ExecutionResult;
import graphql.GraphQL;
import graphql.schema.DataFetcher;
import graphql.schema.GraphQLCodeRegistry;
import graphql.schema.GraphQLSchema;
import graphql.schema.idl.*;
import graphql.schema.idl.RuntimeWiring.Builder;
import graphql.schema.visibility.DefaultGraphqlFieldVisibility;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import r.demo.graphql.annotation.Gql;
import r.demo.graphql.annotation.GqlDataFetcher;
import r.demo.graphql.core.GraphUseCase;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.Map;

@Component
public class GraphQLApi implements GraphUseCase {
    private GraphQL graphQL;
    DefaultListableBeanFactory beanFactory;

    @Value("classpath:static/graphql/schema.graphqls")
    Resource resource;

    public GraphQLApi(DefaultListableBeanFactory beanFactory) {
        this.beanFactory = beanFactory;
    }

    @Bean
    public GraphQL graphQL() {
        return graphQL;
    }

    @PostConstruct
    public void init() throws IOException {
        File sdl = resource.getFile();
        GraphQLSchema graphQLSchema = buildSchema(sdl);
        this.graphQL = GraphQL.newGraphQL(graphQLSchema).build();
    }

    private GraphQLSchema buildSchema(File sdl) {
        TypeDefinitionRegistry typeDefinitionRegistry = new SchemaParser().parse(sdl);
        RuntimeWiring runtimeWiring = buildWiring();
        return new SchemaGenerator().makeExecutableSchema(typeDefinitionRegistry, runtimeWiring);
    }

    private RuntimeWiring buildWiring() {
        return createBuilderByAnnotation()
                .scalar(new Scalar().longScalar())
                .codeRegistry(GraphQLCodeRegistry.newCodeRegistry()
                        .fieldVisibility(DefaultGraphqlFieldVisibility.DEFAULT_FIELD_VISIBILITY)
                        .build())
                .build();
    }

    public Builder createBuilderByAnnotation() {
        Builder builder = null;
        try {
            builder = RuntimeWiring.newRuntimeWiring();
            Map<String, Object> classes = beanFactory.getBeansWithAnnotation(Gql.class);
            Class<?> clz;
            GqlDataFetcher gdf;

            // adding dataFetchers automatically
            for (Object obj : classes.values()) {
                clz = obj.getClass();
                for (Method method : clz.getMethods()) {
                    if (method.isAnnotationPresent(GqlDataFetcher.class)) {
                        gdf = method.getAnnotation(GqlDataFetcher.class);
                        builder.type(
                                TypeRuntimeWiring
                                        .newTypeWiring(gdf.type().getValue())
                                        .dataFetcher(method.getName(), (DataFetcher<?>) method.invoke(obj))
                        );
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return builder;
    }

    @Override
    public ExecutionResult execute(String query) {
        return graphQL.execute(query);
    }
}
