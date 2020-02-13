const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const Video = mongoose.model("Video")
const LikeVideo = mongoose.model("LikeVideo")
const auth = require("../middleware/auth")

router.post("/list_video_course", async function(req, res) {
    const {offset, limit} = req.body
    const list_course_video = await Course.find({}).skip(offset).limit(limit).populate({
        path: "list_video",
        select: "-author"
    })
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

router.get("/:id_video", auth, async function(req, res) {
    const id_video = req.params.id_video
    const id_user = req.user._id
    const video = await Video.findOne({_id: id_video}).populate({
        path : "author",
        select: "_id name email img_avatar teacher"
    })
    const user_like = await LikeVideo.findOne({$and: [{id_user: id_user}, {id_video: id_video}]})
    if (user_like != null){
        video.is_like = true
    } else {
        video.is_like = false
    }
    video.user_seen += 1
    await video.save()
    res.send({
        status  : true,
        message : "Successful",
        data    : video
    })
})

router.post("/like", auth, async function(req, res) {
    const id_user = req.user._id;
    const {id_video, like} = req.body
    if (like) {
        const like = LikeVideo()
        like.id_user = id_user
        like.id_video = id_video
        await like.save()
    } else {
        await LikeVideo.deleteOne({$and: [{id_user: id_user}, {id_video: id_video}]})
    }
    res.send({
        status  : true,
        message : "Successful",
    })
})

module.exports = router;

