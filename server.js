require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');

const {uploadImage} = require('./uploader-service');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// set up multer to hold the file in RAM as a Buffer
const memoryStorage = multer.memoryStorage();

// init multer without validation which we'll handle ourserlves
const upload = multer({
  storage: memoryStorage,
});

app.post('/upload', upload.single('image'), uploadImage);


app.listen(port, () => {
  console.log(`Image uploader microservice listening on port ${port}`);
});