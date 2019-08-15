module.exports = {
    Query: {
        getUser: () => null
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