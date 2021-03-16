const router = require("express").Router()
const mongoose = require("mongoose")
const uploadTheory = require("../middleware/upload_theory")
const uploadExercise = require("../middleware/upload_exercise")
const uploadImage = require("../middleware/upload_image")
const Image = mongoose.model("Image")
const fs = require('fs');

router.post("/images", uploadImage.single("data"), function(req, res, next) {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send({
        status  : true,
        message : "Successful",
        data    : file.path
    })
})

router.post("/multiple_images", uploadImage.array("data"), function(req, res, next) {
    const listFile = req.files.map((e) => e.path);
    console.log(listFile)
    // const files = req.files
    // if (!files) {
    //     const error = new Error('Please upload a file')
    //     error.httpStatusCode = 400
    //     return next(error)
    // }
    res.send({
        status  : true,
        message : "Successful",
        data    : listFile
    })
})

router.post("/theories", uploadTheory.single("data"), function(req, res) {
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

router.post("/exercises", uploadExercise.single("data"), function(req, res) {
    console.log(req.body)
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

//for admin
router.post("/files", uploadTheory.single("data"), function(req, res) {
    console.log(req.body)
    console.log(req.file)
    res.send({
        status  : true,
        message : "Successful",
        data    : req.file.path
    })
    // const image = new Image()
    // image.data = req.file.path
    // image.save(function(err, data) {
    //     if(err) throw err
        
    // })
})

module.exports = router;

