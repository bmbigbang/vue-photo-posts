const mongoose = require('mongoose');
const md5 = require('md5');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
   username: {
       type: String,
       required: true,
       unique: true,
       trim: true
   },
   email: {
       type: String,
       required: true,
       trim: true
   },
   password: {
       type: String,
       required: true,
   },
   avatar: {
       type: String
   },
   joinDate: {
       type: Date,
       default: Date.now
   },
   favorites: {
       type: [mongoose.Schema.Types.ObjectId],
       required: true,
       ref: 'Post'
   }
});

// create avatar for user prior to 'save'
UserSchema.pre('save', function(next) {
  this.avatar = `http://gravatar.com/avatar/${md5(this.username)}?d=identicon`;
  next();
});

// Hash password so it can't be seen without database access
UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      // hashed password
      this.password = hash;
      next();
    })
  });
});

module.exports = mongoose.model('User', UserSchema);