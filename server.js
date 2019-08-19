const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Import typeDefs and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require("./resolvers");

// Import Environment Variables and Mongoose Models
require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const Post = require('./models/Post');

// Connect to Mongo Atlas Database
mongoose
    .connect(
        process.env.MONGO_URI,
        { useNewUrlParser: true })
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));

// verify JWT passed from the client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError('Your session has ended. Pleasee sign in again.');
    }
  }
};

// Create Apollo/GraphQL Server using typeDefs, resolvers, and context objects
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers['authorization'];
    return { User, Post, currentUser: await getUser(token) };
  }
});


// default port is 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT).then(({ url }) => {
  console.log(`Server listening ${url}`);
});