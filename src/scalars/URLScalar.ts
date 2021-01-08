import { GraphQLError, GraphQLScalarType, Kind } from "graphql"

const URLScalar = new GraphQLScalarType({
    name: 'URL',
    description: 'URL scalar type',

    serialize: (value: string) => {
    },

    parseValue: (value) => value,

    parseLiteral: (ast) => {
        switch (ast.kind) {
            case Kind.STRING:
                if (!/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(ast.value)) throw new GraphQLError(`${ast.value} is not a URL.`, ast)
                return ast.value
        }
    }
})

export default URLScalar