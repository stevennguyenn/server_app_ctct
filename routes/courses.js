const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")

router.get("/list_course", async (req, res) => {
    const {offset, limit} = req.body;
    const courses = await Course.find({}).skip(offset).limit(limit);
    res.send({
        status  : true,
        message : null,
        data    : courses
    })
})

module.exports = router