package r.demo.graphql.annotation;

public enum GqlType {
    QUERY("Query"), MUTATION("Mutation");

    private final String value;

    GqlType(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }
}
