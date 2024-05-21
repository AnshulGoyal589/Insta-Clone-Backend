const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

mongoose.connect('mongodb://127.0.0.1:27017/insta')
  .then(() => console.log("DB connected successfully".yellow))
  .catch((err) => console.log(err));
 
 
  const postSchema = new mongoose.Schema({
    sender:String,
    content:String,
    profilePic: String ,
    likes:Number,
    id:String,
    likeslist:[String],
    review : [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref : "Review"
      }
    ]
  });


const Post = mongoose.model("Post", postSchema);

module.exports = Post;
