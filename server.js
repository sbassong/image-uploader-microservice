require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());


app.post('/upload', async (req, res) => {
});


app.listen(port, () => {
  console.log(`Image uploader microservice listening on http://localhost:${port}`);
});