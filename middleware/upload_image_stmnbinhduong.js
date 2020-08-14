const multer = require("multer")
const path = require('path')

const storage = multer.diskStorage({
    destination: "upload/images_stmnbinhduong",
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

module.exports = multer({storage: storage})