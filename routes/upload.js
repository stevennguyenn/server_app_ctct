const router = require("express").Router()
const mongoose = require("mongoose")
const uploadTheory = require("../middleware/upload_theory")
const uploadExercise = require("../middleware/upload_exercise")
const uploadImage = require("../middleware/upload_image")
const Image = mongoose.model("Image")
const fs = require('fs');

router.post("/images", function(req, res) {
    const {data, name} = req.body
    const path = "upload/images/" + name + Date.now() + ".jpg"
    console.log(data)
    const base64Data = data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    fs.writeFileSync(path, base64Data,  {encoding: 'base64'})
    res.send({
        status  : true,
        message : "Successful",
        data    : path
    })
})

router.post("/image", uploadImage.single("data"), function(req, res, next) {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file.path)
})

router.post("/theories", uploadTheory.single("file"), function(req, res) {
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

router.post("/exercises", uploadExercise.single("file"), function(req, res) {
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

