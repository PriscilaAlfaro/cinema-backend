const path = require('path');

const checkFileType = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb('Error: Images Only!');
};

module.exports = checkFileType;
