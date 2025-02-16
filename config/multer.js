const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const unique = Math.floor(Math.random() * 100000000);
        return cb(null, file.fieldname + '-' + unique);
    }
});

module.exports = multer({ storage: storage });