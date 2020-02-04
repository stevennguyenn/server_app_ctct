const fs = require("fs")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: "upload/file/exercises",
    filename: function(req, file, cb) {
        // console.log(req)
        // console(file.fieldname)
        cb(null, file.fieldname + "-" + Date.now() + ".pdf")
    }
})

module.exports = multer({storage: storage})