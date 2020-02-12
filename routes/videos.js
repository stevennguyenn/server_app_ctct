const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")

router.post("/list_video_course", function(req, res) {
    const {offset, limit} = req.body
    const list_course_video = await Course.find({}).skip(offset).limit(limit).populate("list_video")
    res.send({
        status  : true,
        message : "Successful",
        data    : list_course_video
    })
})

module.exports = router;

