const express = require('express');
const router = express.Router();
const cors = require('cors');
const User = require('../models/User');
const Review = require('../models/Review');
const Post = require('../models/Post');
const passport = require('passport');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types; 
const fs = require('fs');


const multer  = require('multer')

const corsOptions = {
  origin: 'http://localhost:3000'
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/src/profileimages/');  
  },
  filename: function (req, file, cb) {
    
    file.originalname="post"+req.body.username+".jpeg";
    cb(null,  file.originalname);
  }
});
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, './postimages/'); 
    cb(null, '../frontend/src/images/'); 
  },
  filename: function (req, file, cb) {
    // console.log("SERVER SENDER: ",req.body.sender);
    file.originalname=Date.now()+req.body.sender+"post.jpeg";
    cb(null,  file.originalname);
  }
});
  

const upload = multer({ storage });
const upload2 = multer({ storage: storage2 }); 

router.post('/register', cors(corsOptions), upload.single('pic'), async (req, res) => {
  try {
    console.log('Received a POST request to /register'); 

    const { username, emailId, password,firstName,lastName,desc } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this username already exists.' });
    }
    

    const user = new User({
      username: username,
      emailId: emailId,
      profilePic: req.file ? req.file.path : null, // Store the file path or null if no file uploaded
      firstName:firstName,
      lastName:lastName,
      desc:desc,
    });

    // Register the user
    const newUser = await User.register(user, password);

    console.log(req.file);
    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});
router.post('/send', cors(corsOptions), upload2.single('pic'), async (req, res) => {
  try {
    console.log('Received a POST request to /send'); 

    const { content,sender,id } = req.body;
    const user=await User.findOne({username:sender});
    const postt = new Post({
      sender:sender,
      content:content,
      profilePic: req.file ? req.file.originalname : null, // Store the file path or null if no file uploaded
      id:id
    });

  
    user.post.push(postt);
  
    await user.save();

    await Post.insertMany(postt);

    console.log(req.file);
    res.status(201).json({ message: 'Post made successfully.'});
  } catch (error) {
    console.error('Error during making POST:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});
router.get('/homePage', cors(corsOptions), async (req, res) => {
  try {

    const posts=await Post.find({});
    res.status(201).json(posts);
  } catch (error) {
    console.error('Error during making POST:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});
router.get('/userDetails', cors(corsOptions), async (req, res) => {
  try {

    const users=await User.find({});
    res.status(201).json(users);
  } catch (error) {
    console.error('Error during fetching users:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});
router.post("/login", cors(corsOptions) , (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
      }

      console.log('Eureka!!');
      return res.status(200).json({ message: 'Login successful.', user });
    });
  })(req, res, next);
});
router.post('/updateLikes', cors(corsOptions), async (req, res) => {
  try {
    const { sender, profilePic } = req.body;
    const post = await Post.findOne({profilePic:profilePic});
    const numberOfLikes = post.likes+1;
    const updateResult = await Post.updateOne(
      { profilePic:profilePic },
      { $push: { likeslist: sender } }
    );
    await Post.findOneAndUpdate({profilePic:profilePic},{ $set: { likes:numberOfLikes } })
    res.status(201).send("ok");
  } catch (error) {
    console.error('Error during fetching users:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});
router.post('/updateLikesn', cors(corsOptions), async (req, res) => {
  try {
    const { sender, profilePic } = req.body;
    const post = await Post.findOne({profilePic:profilePic});
    const numberOfLikes = post.likes-1;
    const updateResult = await Post.updateOne(
      { profilePic:profilePic},
      { $pull: {likeslist: sender } }
    );
    await Post.findOneAndUpdate({profilePic:profilePic},{ $set: { likes:numberOfLikes } })
    res.status(201).send("ok");
  } catch (error) {
    console.error('Error during fetching users:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});
router.post("/review", cors(corsOptions) , async(req, res) => {


  const { text,owner,id } = req.body;

  const post=await Post.findOne({id:id});
  const revieww=await Review.create({text,owner});

  post.review.push(revieww);

  await post.save();

  


});


// router.post("/search", cors(corsOptions) , async(req, res) => {


//   const { sender } = req.body;
//   const user=await User.findOne({username:sender}); 
//   if(user.post){
//     const responses = await Promise.all(user.post.map(async(item,index)=>{

//       const rev=await Post.findById(item.toString());
      
//       return rev
  
//     })) 
    
//     const jsonData = JSON.stringify(responses);
//     res.status(201).send(jsonData);
    
//   }
// });


router.post("/postShow", cors(corsOptions) , async(req, res) => {


  const { sender } = req.body;
  const user=await User.findOne({username:sender}); 
  if(user.post){
    const responses = await Promise.all(user.post.map(async(item,index)=>{

      const rev=await Post.findById(item.toString());
      
      return rev
  
    })) 
    
    const jsonData = JSON.stringify(responses);
    res.status(201).send(jsonData);
    
  }
 
});
router.post("/reviewShow", cors(corsOptions) , async(req, res) => {


  const { id } = req.body;
  const post=await Post.findOne({id}); 
  if(post.review){
    const responses = await Promise.all(post.review.map(async(item,index)=>{

      const rev=await Review.findById(item.toString());
      
      return rev
  
    }))
    
    const jsonData = JSON.stringify(responses);
    res.status(201).send(jsonData);
    
  }
 
});
router.post("/followShow", cors(corsOptions) , async(req, res) => {


  const { sender } = req.body;
  
  await User.updateOne({ username: sender }, { $push: { followers: sender } });
  const user=await User.findOne({username: sender}); 

  const responses=user.followers.length;
 
    
  const jsonData = JSON.stringify(responses);
  res.status(201).send(jsonData);
    

 
});



module.exports = router;
