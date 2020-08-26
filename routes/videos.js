const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const Video = mongoose.model("Video")
const LikeVideo = mongoose.model("LikeVideo")
const Comment = mongoose.model("Comment")
const auth = require("../middleware/auth")
const Theory = require("../models/theory/Theory")

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

router.get("/:id_video", auth, async function(req, res) {
    const id_video = req.params.id_video
    const id_user = req.user._id
    const video = await Video.findOne({_id: id_video})
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
    const list_video = await Video.find({course: id_theory}).skip(offset).limit(limit)
    res.send({
        status  : true,
        message : "Successful",
        data    : list_video
    })
})

router.post("/video_course/search", async (req, res) => {
    console.log("i am here");
    const {id_course, offset, limit, text} = req.body
    let list_video = await Video.find({course : id_course, name: {$regex: new RegExp(text, 'i')}}).populate().skip(offset).limit(limit)
    list_video.sort((a, b) => {
        if (a.name.toLocaleLowerCase().lastIndexOf(text.toLocaleLowerCase(), 0) === 0)  {return -1}
        if (b.name.toLocaleLowerCase().lastIndexOf(text.toLocaleLowerCase(), 0) === 0)  {return 1}
        return 0;
    })
    res.send({
        status  : true,
        message : null,
        data    : list_video
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
    const comments = await Comment.find({$and : [{video: id_video}, {is_parent: true}]})
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
    const comment = new Comment()
    comment.user = id_user
    comment.content = content
    comment.video = id_video
    comment.children = []
    if (id_parent == null) {
        comment.is_parent = true
        await comment.save();
    } else {
        const parent_comment = await Comment.findOne({_id: id_parent})
        comment.is_parent = false
        await comment.save()
        parent_comment.children.push(comment)
        await parent_comment.save()
    }
    const commentPopulate = await Comment.populate(comment, {path: "user", select: "_id name email img_avatar"})
    res.send({
        status  : true,
        message : "Successful",
        data    : commentPopulate
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

