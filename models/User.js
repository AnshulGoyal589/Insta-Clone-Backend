const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  emailId: String,
  name:String,
  desc:String,
  profilePic: String ,
  firstName: String ,
  lastName: String ,
  desc: String ,
  followers:[String],
  following:[String],
  post : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Post"
    }
  ]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;
