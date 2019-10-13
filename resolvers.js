const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getCurrentUser: async (_parent, args, { User, currentUser }) => {
      if (!currentUser) return null;
      const user = await User.findOne({ username: currentUser.username }).populate({
        path: 'favorites',
        model: 'Post'
      });
      return user;
    },
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
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      const posts = await Post.find({
        createdBy: userId
      });
      return posts;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: 'messages.messageUser',
        model: "User"
      });
      return post;
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResults = await Post.find(
            // Perform text search using the searchTerm provided
            { $text: { $search: searchTerm } },
            // Assign 'searchTerm' a text score to provide best match
            { score: { $meta: 'textScore' } }
        ).sort({
          // Sort results according to textScore from the search result
          score: { $meta: 'textScore' },
          likes: 'desc'
        }).limit(5);

        return searchResults;
      }
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({}).sort({ createdDate: 'desc' }).populate({
          path: 'createdBy',
          model: 'User'
        }).limit(pageSize);
      } else {
        // if we have gone past the first page
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({}).sort({ createdDate: 'desc' }).populate({
          path: 'createdBy',
          model: 'User'
        }).skip(skips).limit(pageSize);
        const totalDocs = await Post.countDocuments();
        const hasMore = totalDocs > (pageSize * pageNum);
        return { posts , hasMore };
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return { posts, hasMore };
    }
  },
  Mutation: {
    addPost: async (_parent, { title, imageUrl, categories, description, createdById }, { Post }) => {
      return await new Post({
        title, imageUrl, categories, description,
        createdBy: createdById
      }).save();
    },
    updateUserPost: async (_, { postId, userId, title, imageUrl, categories, description }, { Post }) => {
      const post = await Post.findOneAndUpdate(
          {_id: postId, createdBy: userId },
          { $set: { title, imageUrl, categories, description } },
          { new: true }
      );
      return post;
    },
    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      };
      const post = await Post.findOneAndUpdate({ _id: postId },
          // prepend (using $push) new message to the beginning of the array
          { $push: { messages: { $each: [newMessage], $position: 0 } } },
          { new: true }
      ).populate({
        path: 'messages.messageUser',
        model: 'User'
      });
      return post.messages[0];
    },
    likePost: async (_, { postId, username }, { Post, User }) => {
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1} },
        { new: true }
      );
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
          path: 'favorites',
          model: 'Post'
      });
      return { likes: post.likes, favorites: user.favorites };
    },
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      const post = await Post.findOneAndUpdate(
          { _id: postId },
          { $inc: { likes: -1} },
          { new: true }
      );
      const user = await User.findOneAndUpdate(
          { username },
          { $pull: { favorites: postId } },
          { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      });
      return { likes: post.likes, favorites: user.favorites };
    },
    signInUser: async (_parent, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not registered');
      }

      // compare input password to hashed stored pass
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      return { token: createToken(user, process.env.SECRET, '1hr') }
    },
    signUpUser: async (_parent, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) throw new Error('User already exists');

      const newUser = await new User({
        username, email, password
      }).save();

      return { token: createToken(newUser, process.env.SECRET, '1hr') }
    }
  }
};