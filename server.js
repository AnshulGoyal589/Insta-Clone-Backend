const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const colors = require("colors");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("./models/User");
const cors = require('cors');
const multer  = require('multer')
const upload = multer()
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 8000; 


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connected successfully".yellow))
  .catch((err) => console.error(err));


  io.on('connection', (socket) => {
    socket.on('foo', (data) => {
      console.log('Received foo event:', data);
    });
  });
  
  
  

const sessionConfig = {
  secret: 'weneedagoodsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 
  }
}

const authApi = require('./apis/authApi'); 

app.use(bodyParser.json());  
app.use(express.urlencoded({ extended: true }));



app.use(cors({
  origin: process.env.FRONTEND_URL,
})); 

app.use(cookieParser('keyboardcat')); 
app.use(session(sessionConfig)); 
app.use(passport.session());
app.use(passport.authenticate('session'));


app.use('/auth', authApi);


passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

app.get('/auth/session', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
 
app.get('/allUsers',async(req,res)=>{

    const users = await User.find({});

    res.json({users});

})


app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`.red);
});
