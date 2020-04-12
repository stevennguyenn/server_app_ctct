const _ = require('lodash')
const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const Theory = mongoose.model("Theory")
const LikeTheory = mongoose.model("LikeTheory")
const CommentTheory = mongoose.model("CommentTheory")
const auth = require("../middleware/auth")

router.post("/list_course", async (req, res) => {
    const {offset, limit} = req.body
    const courses = await Course.find({}).skip(offset).limit(limit)
    res.send({
        status  : true,
        message : null,
        data    : courses
    })
})

router.post("/list_theory", async (req, res) => {
    const {id_course, offset, limit} = req.body
    const theories = await Theory.find({course : id_course}).populate().skip(offset).limit(limit)
    res.send({
        status  : true,
        message : null,
        data    : theories
    })
})


router.post("/list_theory_find", async (req, res) => {
    const {id_course, offset, limit, text} = req.body
    let theories0 = await Theory.find({course : id_course, name: {$regex: new RegExp('^' + text, 'i')}}).populate().skip(offset).limit(limit)
    let theories1 = await Theory.find({course : id_course, name: {$regex: new RegExp('.' + text, 'i')}}).populate().skip(offset).limit(limit)
    const theories = _.uniqBy(_.flatten([theories0, theories1]), 'name')
    res.send({
        status  : true,
        message : null,
        data    : theories
    })
})

router.get("/:idTheory", auth, async (req, res) => {
    const idUser = req.user._id;
    const idTheory = req.params.idTheory
    const theory = await Theory.findOne({_id : idTheory})
    var liked = false
    const isLike = await LikeTheory.findOne({ $and: [{id_user: idUser}, {id_theory: idTheory}]}).select("+like")
    if (isLike != null) {
        liked = true
    }
    theory.like = liked
    res.send({
        status  : true,
        message : null,
        data    : theory
    })
})

router.post("/like", auth, async (req, res) => {
    const id_user = req.user._id;
    const {id_theory, like} = req.body
    if (like) {
        const like = LikeTheory()
        like.id_user = id_user
        like.id_theory = id_theory
        await like.save()
    } else {

        await LikeTheory.deleteOne({$and: [{id_user: id_user}, {id_theory: id_theory}]})
    }
    res.send({
        status  : true,
        message : "Successful",
    })
})

router.post("/comments", auth, async (req, res) => {
    // const id_user = req.user._id;
    const {id_theory, offset, limit} = req.body
    const comments = await CommentTheory.find({$and : [{theory: id_theory}, {is_parent: true}]})
                        .populate({
                            path: "children",
                            populate: {
                                path: "user",
                                select: "_id name email",
                            }
                        })
                        .populate({
                            path: "user",
                            select: "_id name email",
                        })
                        .exec()
    res.send({
        status  : true,
        message : "Successful",
        data: comments
    })
})

router.post("/add_comment", auth, async (req, res) => {
    const id_user = req.user._id;
    const {id_theory, id_parent, content} = req.body
    const comment = new CommentTheory()
    comment.user = id_user
    comment.content = content
    comment.theory = id_theory
    comment.children = []
    if (id_parent == null) {
        comment.is_parent = true
        await comment.save();
    } else {
        const parent_comment = await CommentTheory.findOne({_id: id_parent})
        comment.is_parent = false
        await comment.save()
        parent_comment.children.push(comment)
        await parent_comment.save()
    }
    const commentPopulate = await CommentTheory.populate(comment, {path: "user", select: "_id name email"})
    res.send({
        status  : true,
        message : "Successful",
        data    : commentPopulate
    })
})


module.exports = router;