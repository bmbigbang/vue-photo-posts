const { gql, ApolloServer } = require("apollo-server");
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

mongoose
    .connect(
        process.env.MONGO_URI,
        { useNewUrlParser: true })
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

const typeDefs = gql`
    type Todo {
        task: String
        completed: Boolean
    }
    
    type Query {
        getTodos: [Todo]
    }
    
    type Mutation {
        addTodo(task: String, completed: Boolean): Todo
    }
`;

const resolvers = {
    Query: {
        getTodos: () => todos
    }
};


const server = new ApolloServer({
    typeDefs
});


// default port is 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT).then(({ url }) => {
    console.log(`Server listening ${url}`);
});