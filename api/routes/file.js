const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const moment = require('moment');

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const date = moment(new Date).format('yyyy/MM/DD');
      const dir = `uploads/${date}`;
      const absPath = path.resolve(__dirname, '../..', 'uploads', date);
      const exists = fs.existsSync(absPath);
  
      if (!exists) {
        fs.mkdirSync(absPath, { recursive: true });
      }
  
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      crypto.pseudoRandomBytes(16, function (err, buf) {
        if (err) {
          return cb(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        cb(null, filename);
      });
    },
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

router.post('/', upload.single('file'), (req, res, next) => {
    return res.status(201).json({
        path: req.file.path
    })
})


module.exports = router;