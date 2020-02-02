const router = require("express").Router()
const mongoose = require("mongoose")
const Image = mongoose.model("Image")
const upload = require("../middleware/upload")

router.post("/images", upload.single("image"), function(req, res) {
    console.log(req.body)
    console.log(req.file)
    const image = new Image()
    image.data = req.file.path
    image.save(function(err, data) {
        if(err) throw err
        res.send({
            status  : true,
            message : "Successful",
            data    : data
        })
    })
})

module.exports = router;