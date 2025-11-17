const VALID_FILES_TYPES = ["image/png", "image/jpeg"];
const ALLOWED_FILE_SIZE = 1024 * 1024 * 5; // 5MB

const validateFileType = (file) => {
  if (!VALID_FILES_TYPES.includes(file.mimetype))
    return new Error("Invalid file type, only JPEG and PNG is allowed.");
  return null;
};

const validateFileSize = (file) => {
  if (file.size > ALLOWED_FILE_SIZE)
    return new Error("File is too large (Max 5MB)");
  return null;
};

module.exports = {
  validateFileSize,
  validateFileType,
};
