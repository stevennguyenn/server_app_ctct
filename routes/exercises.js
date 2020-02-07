const router = require("express").Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const Exercise = mongoose.model("Exercise")

router.post("/list_exercise", auth, async (req, res) => {
    const {offset, limit, id_course, type} = req.body
    const exercises = await Exercise.find({$and : [{course: id_course}, {type: type}]}).skip(offset).limit(limit)
    res.send({
        status  : true,
        message : null,
        data    : exercises
    })
})

router.post("/add_exercise", auth, async (req, res) => {
    const {name, id_course, type, level, theme} = req.body
    const exercise = new Exercise()
    exercise.name = name
    exercise.course = id_course
    exercise.type = type
    exercise.level = level
    exercise.theme = theme
    await exercise.save()
    res.send({
        status  : true,
        message : null,
        data    : exercise
    })
})

module.exports = router;