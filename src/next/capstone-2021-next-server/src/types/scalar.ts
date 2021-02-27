import { GraphQLScalarType } from "graphql";

export const Long = new GraphQLScalarType({
    name: 'Long',
    description: '32-bit Number Data Type',
    parseValue(value) {
        // Implement your own behavior here by setting the 'result' variable
        return Number(value);
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            // Implement your own behavior here by returning what suits your needs
            // depending on ast.kind
            case "FloatValue":
                return Math.floor(Number(ast.value));
            case "IntValue":
                return Number(ast.value);
        }
    }, serialize(value) {
        // Implement your own behavior here by setting the 'result' variable
        return Number(value);
    }
});