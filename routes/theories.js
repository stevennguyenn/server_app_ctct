const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const Theory = mongoose.model("Theory")
const Like = mongoose.model("Like")
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

router.get("/:idTheory", auth, async (req, res) => {
    const idUser = req.user._id;
    const idTheory = req.params.idTheory
    const theory = await Theory.findOne({_id : idTheory})
    var liked = false
    const isLike = await Like.findOne({ $and: [{id_user: idUser}, {id_theory: idTheory}]}).select("+like")
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
        const like = Like()
        like.id_user = id_user
        like.id_theory = id_theory
        await like.save()
    } else {

        await Like.deleteOne({$and: [{id_user: id_user}, {id_theory: id_theory}]})
    }
    res.send({
        status  : true,
        message : "Successful",
    })
})

module.exports = router;