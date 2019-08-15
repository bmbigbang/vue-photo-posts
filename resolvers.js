module.exports = {
    Query: {
        getUser: () => null
    },
    Mutation: {
        signupUser: async (_parent, { username, email, password }, { User }) => {
            const user = await User.findOne({ username });
            if (user) throw new Error('User already exists');

            return await new User({
                username, email, password
            }).save();
        }
    }
};