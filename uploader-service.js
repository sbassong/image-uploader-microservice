const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
// const { validateFileSize, validateFileType } = require('./helpers.js'); // pending Gurveer

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;


async function validateImage(file) {
  if (!file) {
    return res.status(400).json({ message: 'No file was uploaded.' });
  }

  // const sizeError = validateFileSize(file);
  // if (sizeError) {
  //   return res.status(413).json({ message: sizeError.message });
  // }

  // const typeError = validateFileType(file);
  // if (typeError) {
  //   return res.status(415).json({ message: typeError.message });
  // }
} 

async function uploadImage(req, res) {
  try {
    await validateImage(req.file)

    // above validation passed, so we can now upload to S3    
    //create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + path.extname(req.file.originalname);

    // create the command to send to S3
    const s3Params = {
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer, // The file buffer from memory
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(s3Params);

    await s3Client.send(command);

    // construct the url sent back to client
    const fileUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${S3_BUCKET_NAME}/${fileName}`;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
    });
    
  } catch (error) {
    console.error('S3 Upload Error:', error);
    res.status(500).json({ message: 'An error occurred during upload.' });
  }
}

module.exports = {
  uploadImage
}