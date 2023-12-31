const path = require("path");
const multer = require("multer");

//Create a storage configuration  using m.ds
var storage = multer.diskStorage({
  //Define the destination directory for uploaded files
  destination: function (req, file, cb) {
    cb(null, __dirname);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == "image/jpg" || file.mimetype == "image/png") {
      callback(null, true);
    } else {
      console.log("only png and jpg file supported");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

module.exports = upload;
