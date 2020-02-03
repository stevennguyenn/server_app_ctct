const router = require("express").Router()
const mongoose = require("mongoose")
const Image = mongoose.model("Image")
const fs = require('fs');

router.post("/images", function(req, res) {
    const {data, name} = req.body
    const path = "upload/images/" + name + Date.now() + ".jpg"
    const base64Data = data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    fs.writeFileSync(path, base64Data,  {encoding: 'base64'})
    res.send({
        status  : true,
        message : "Successful",
        data    : path
    })
})

module.exports = router;