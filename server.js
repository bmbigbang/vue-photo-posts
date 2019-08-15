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
        getTodos: [Todo]
    }
`;

const resolvers = {
    Query: {
        getTodos: () => todos
    }
};


const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});


// default port is 4000
server.listen().then(({ url }) => {
    console.log(`Server listening ${url}`);
});