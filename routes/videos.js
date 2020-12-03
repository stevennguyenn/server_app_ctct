const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const Video = mongoose.model("Video")
const Like = mongoose.model("Like")
const Comment = mongoose.model("Comment")
const auth = require("../middleware/auth")
const Theory = require("../models/theory/Theory")

router.get("/", async function(req, res) {
    const offset = Number(req.query.offset);
    const limit = Number(req.query.limit);
    const id_course = req.query.id_course;
    const list_video = await Video.find({course: id_course}).skip(offset).limit(limit)
    res.send({
        status  : true,
        message : null,
        data    : list_video
    })
})

router.get("/:id_video", auth, async function(req, res) {
    const id_video = req.params.id_video
    const id_user = req.user._id
    const video = await Video.findOne({_id: id_video})
    const user_like = await Like.findOne({$and: [{id_user: id_user}, {id_content: id_video}]})
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
        const like = Like()
        like.id_user = id_user
        like.id_content = id_video
        like.type = "video"
        await like.save()
    } else {
        await Like.deleteOne({$and: [{id_user: id_user}, {id_content: id_video}]})
    }
    res.send({
        status  : true,
        message : "Successful",
    })
})

router.post("/list_video_course", async function(req, res) {
    const {offset, limit} = req.body
    const list_course_video = await Course.find({}).skip(offset).limit(limit)
    res.send({
        status  : true,
        message : "Successful",
        data    : list_course_video
    })
})

router.post("/add_video", auth, async function(req, res) {
    const {name, img_background, time, course, url, description, documents} = req.body
    const video = new Video()
    video.name = name
    video.img_background = img_background
    video.time = time
    video.course = course
    video.url = url
    video.description = description
    video.documenst = documents
    await video.save()
    res.send({
        status  : true,
        message : "Successful",
        data    : video
    })
})

router.post("/relate_video_course", async function(req, res) {
    const {offset, limit, id_theory, id_video} = req.body
    const list_video = await Video.find({course: id_theory, _id: {$ne: id_video}}).skip(offset).limit(limit)
    res.send({
        status  : true,
        message : "Successful",
        data    : list_video
    })
})

router.post("/relate_document", auth, async (req, res) => {
    const {id_theories} = req.body
    const theories = await Theory.find({_id : {$in: id_theories}});
    res.send({
        status  : true,
        message : "Successful",
        data    : theories
    })
})

module.exports = router;

