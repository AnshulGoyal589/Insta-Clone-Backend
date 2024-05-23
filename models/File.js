const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const upload = multer();

 

  const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    fileData: Buffer
  });


const File = mongoose.model("File", fileSchema);

module.exports = File;
