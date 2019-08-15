const { ApolloServer } = require("apollo-server");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require("./resolvers");

require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const Post = require('./models/Post');

mongoose
    .connect(
        process.env.MONGO_URI,
        { useNewUrlParser: true })
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

const server = new ApolloServer({
    typeDefs,
    context: {
        User,
        Post
    },
    resolvers
});


// default port is 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT).then(({ url }) => {
    console.log(`Server listening ${url}`);
});