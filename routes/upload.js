const router = require("express").Router()
const mongoose = require("mongoose")
const uploadTheory = require("../middleware/upload_theory")
const uploadExercise = require("../middleware/upload_exercise")
const uploadImage = require("../middleware/upload_image")
const uploadImageDucHoa = require("../middleware/upload_image_duchoa")
const uploadImageSiQuocDan = require("../middleware/upload_image_siquocdan")
const uploadImageStmnBinhDuong = require("../middleware/upload_image_stmnbinhduong")
const uploadImageHungHa = require("../middleware/upload_image_hungha")
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

router.post("/duchoa/images", function(req, res, next) {
    let upload = uploadImageDucHoa.single("data")
    upload(req,res,function(err) {
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
})

router.delete("/duchoa/images", function(req, res, next) {
    const { url } = req.body
    console.log(url);
    fs.unlink(url, (err) => {
        if (err) {
            console.log(err.message)
            const error = new Error('File not found')
            error.httpStatusCode = 400
            return next(error)
        }
        res.send({
            status  : true,
            message : "Successful",
        })
      });
});

router.post("/siquocdan/images", function(req, res, next) {
    let upload = uploadImageSiQuocDan.single("data")
    upload(req,res,function(err) {
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
})

router.delete("/siquocdan/images", function(req, res, next) {
    const { url } = req.body
    console.log(url);
    fs.unlink(url, (err) => {
        if (err) {
            console.log(err.message)
            const error = new Error('File not found')
            error.httpStatusCode = 400
            return next(error)
        }
        res.send({
            status  : true,
            message : "Successful",
        })
      })
})


router.post("/stmnbinhduong/images", function(req, res, next) {
    let upload = uploadImageHungHa.single("data")
    upload(req,res,function(err) {
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
})

router.delete("/stmnbinhduong/images", function(req, res, next) {
    const { url } = req.body
    console.log(url);
    fs.unlink(url, (err) => {
        if (err) {
            console.log(err.message)
            const error = new Error('File not found')
            error.httpStatusCode = 400
            return next(error)
        }
        res.send({
            status  : true,
            message : "Successful",
        })
      })
})

router.post("/hungha/images", function(req, res, next) {
    let upload = uploadImageHungHa.single("data")
    upload(req,res,function(err) {
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
})

router.delete("/hungha/images", function(req, res, next) {
    const { url } = req.body
    console.log(url);
    fs.unlink(url, (err) => {
        if (err) {
            console.log(err.message)
            const error = new Error('File not found')
            error.httpStatusCode = 400
            return next(error)
        }
        res.send({
            status  : true,
            message : "Successful",
        })
      })
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

