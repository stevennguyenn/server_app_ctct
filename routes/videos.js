const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const Video = mongoose.model("Video")
const auth = require("../middleware/auth")

router.post("/list_video_course", async function(req, res) {
    const {offset, limit} = req.body
    const list_course_video = await Course.find({}).skip(offset).limit(limit).populate("list_video")
    res.send({
        status  : true,
        message : "Successful",
        data    : list_course_video
    })
})

router.post("/add_video", auth, async function(req, res) {
    const {name, type, img_background, time, course, url} = req.body
    const course_entity = await Course.findOne({_id: course})
    const video = new Video()
    video.name = name
    video.type = type
    video.img_background = img_background
    video.time = time
    video.course = course
    video.url = url
    if (course_entity.list_video.length >= 20) {
        course_entity.list_video.slice(0,-1)
    } 
    if (course_entity.list_video.length == 0){
        course_entity.list_video.push(video._id)
    } else {
        course_entity.list_video.insert(0, video._id)
    }
    await video.save()
    await course_entity.save()
    res.send({
        status  : true,
        message : "Successful",
        data    : video
    })
})

module.exports = router;

