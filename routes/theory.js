const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const Theory = mongoose.model("Theory")

router.get("/list_course", async (req, res) => {
    const {offset, limit} = req.body;
    const courses = await Course.find({}).skip(offset).limit(limit);
    res.send({
        status  : true,
        message : null,
        data    : courses
    })
})

router.get("/:idCourse", async (req, res) => {
    const {offset, limit} = req.body
    const idCourse = req.params.idCourse
    const theories = await Theory.find({course : idCourse}).skip(offset).limit(limit)
    res.send({
        status  : true,
        message : null,
        data    : theories
    })
})

module.exports = router