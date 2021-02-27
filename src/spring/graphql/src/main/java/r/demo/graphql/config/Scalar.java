package r.demo.graphql.config;

import graphql.language.IntValue;
import graphql.schema.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Scalar {
    @Bean
    public GraphQLScalarType longScalar() {
        return GraphQLScalarType.newScalar()
                .name("Long")
                .description("Java primitive long type (64bit)")
                .coercing(new Coercing<Long, Integer>() {
                    @Override
                    public Integer serialize(final Object dataFetcherResult) throws CoercingSerializeException {
                        if (dataFetcherResult instanceof Long) {
                            return ((Long) dataFetcherResult).intValue();
                        } else {
                            throw new CoercingSerializeException("Expected a Long object.");
                        }
                    }

                    @Override
                    public Long parseValue(Object input) throws CoercingParseValueException {
                        try {
                            if (input instanceof Integer) {
                                return Long.parseLong(String.valueOf(input));
                            } else {
                                throw new CoercingParseValueException("Expected a Integer.");
                            }
                        } catch (IllegalArgumentException e) {
                            throw new CoercingParseValueException(String.format("Not a valid long: %s", input), e);
                        }
                    }

                    @Override
                    public Long parseLiteral(Object input) throws CoercingParseLiteralException {
                        if (input instanceof IntValue) {
                            try {
                                return ((IntValue) input).getValue().longValue();
                            } catch (IllegalArgumentException e) {
                                throw new CoercingParseLiteralException(e);
                            }
                        } else {
                            throw new CoercingParseLiteralException("Expected a IntValue.");
                        }
                    }
                })
                .build();
    }
}
