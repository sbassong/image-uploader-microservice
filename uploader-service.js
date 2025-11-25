const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { validateFileSize, validateFileType, generateUniqueFilename } = require("./helpers.js");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function validateImageFile(file) {
  const sizeError = validateFileSize(file);
  const typeError = validateFileType(file);

  if (!file) {
    return { message: "No file was uploaded.", status: 400 };
  } else if (sizeError) {
    return { message: sizeError.message, status: 413 };
  } else if (typeError) {
    return { message: typeError.message, status: 415 };
  } else return null;
};

async function uploadImage(req, res) {
  try {
    const isInvalidFile = await validateImageFile(req.file)

    if (isInvalidFile) {
      return res.status(isInvalidFile.status).json({ message: isInvalidFile.message });
    }

    const fileName = generateUniqueFilename(req.file.originalname);

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
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "An error occurred during upload." });
  }
}

module.exports = {
  uploadImage,
};
