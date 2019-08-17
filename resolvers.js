module.exports = {
  Query: {
    getPosts: async (_parent, args, { Post }) => {
      const posts = await Post.find({}).sort({ createdDate: 'desc' })
      // when populating
      // property ('createdBy') in the definition will be the path specified
      // and reference ('User') of the definition will be the model specified
          .populate({
            path: 'createdBy',
            model: 'User'
          });
      return posts;
    }
  },
  Mutation: {
    addPost: async(_parent, { title, imageUrl, categories, description, createdById }, { Post }) => {
      return await new Post({
        title, imageUrl, categories, description,
        createdBy: createdById
      }).save();
    },
    signupUser: async (_parent, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) throw new Error('User already exists');

      return await new User({
        username, email, password
      }).save();
    }
  }
};