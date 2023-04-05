const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/images');
      },
      filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const filename = uuid.v4() + extension;

        cb(null, filename);
      }
})

module.exports =  multer({ storage: storage })