const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const Video = mongoose.model("Video")
const LikeVideo = mongoose.model("LikeVideo")
const CommentVideo = mongoose.model("CommentVideo")
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
    const {name, type, img_background, time, course, url, author, description, document} = req.body
    const course_entity = await Course.findOne({_id: course})
    const video = new Video()
    video.name = name
    video.type = type
    video.img_background = img_background
    video.time = time
    video.course = course
    video.url = url
    video.author = author
    video.description = description
    video.document = document
    if (course_entity.list_video.length >= 20) {
        course_entity.list_video.slice(0,-1)
    } 
    if (course_entity.list_video.length == 0){
        course_entity.list_video.push(video._id)
    } else {
        console.log(course_entity.list_video)
        course_entity.list_video.splice(0, 0, video._id)
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

router.post("/video_course", async function(req, res) {
    const {offset, limit, id_theory} = req.body
    const list_video = await Video.find({course: id_theory}).skip(offset).limit(limit).populate({
        path: "author",
        select: "_id name email img_avatar"
    })
    res.send({
        status  : true,
        message : "Successful",
        data    : list_video
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

router.post("/comments", auth, async (req, res) => {
    const {id_video, offset, limit} = req.body
    const comments = await CommentVideo.find({$and : [{video: id_video}, {is_parent: true}]})
                        .skip(offset).limit(limit)
                        .populate({
                            path: "children",
                            populate: {
                                path: "user",
                                select: "_id name email img_avatar",
                            }
                        })
                        .populate({
                            path: "user",
                            select: "_id name email img_avatar",
                        })
    res.send({
        status  : true,
        message : "Successful",
        data: comments
    })
})

router.post("/add_comment", auth, async (req, res) => {
    const id_user = req.user._id;
    const {id_video, id_parent, content} = req.body
    const comment = new CommentVideo()
    comment.user = id_user
    comment.content = content
    comment.video = id_video
    comment.children = []
    if (id_parent == null) {
        comment.is_parent = true
        await comment.save();
    } else {
        const parent_comment = await CommentVideo.findOne({_id: id_parent})
        comment.is_parent = false
        await comment.save()
        parent_comment.children.push(comment)
        await parent_comment.save()
    }
    const commentPopulate = await CommentVideo.populate(comment, {path: "user", select: "_id name email img_avatar"})
    res.send({
        status  : true,
        message : "Successful",
        data    : commentPopulate
    })
})



module.exports = router;

