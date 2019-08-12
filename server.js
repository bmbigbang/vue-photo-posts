const { gql, ApolloServer } = require("apollo-server");

const todos = [
    { task: 'Open app', completed: false },
    { task: 'Authenticate', completed: true }
];

const typeDefs = gql`
    type Todo {
        task: String
        completed: Boolean
    }
    type Query {
        _dummy: String
    }
`;

const server = new ApolloServer({
    typeDefs: typeDefs
});

server.listen().then(({ url }) => {
    console.log(`Server listening ${url}`);
});