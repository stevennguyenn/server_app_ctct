const fs = require("fs")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: "upload/videos",
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".mp4")
    }
})

module.exports = multer({storage: storage})