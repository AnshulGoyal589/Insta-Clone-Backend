const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

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
