const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const upload = multer();


mongoose.connect('mongodb://127.0.0.1:27017/insta')
  .then(() => console.log("DB connected successfully".yellow))
  .catch((err) => console.log(err));
 

  const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    fileData: Buffer
  });


const File = mongoose.model("File", fileSchema);

module.exports = File;
