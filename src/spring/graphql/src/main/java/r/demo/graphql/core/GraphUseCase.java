package r.demo.graphql.core;

import graphql.ExecutionResult;

public interface GraphUseCase {
    ExecutionResult execute(String query);
}
