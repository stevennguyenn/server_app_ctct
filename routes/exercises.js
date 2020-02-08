const router = require("express").Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const Exercise = mongoose.model("Exercise")
const Question = mongoose.model("Question")
const Option = mongoose.model("Option")

router.post("/list_exercise", auth, async (req, res) => {
    const {offset, limit, id_course, type} = req.body
    const exercises = await Exercise.find({$and : [{course: id_course}, {type: type}]}).skip(offset).limit(limit).select("-questions -course")
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
    // exercise.theme = theme
    await exercise.save()
    res.send({
        status  : true,
        message : null,
        data    : exercise
    })
})

router.post("/create_question", auth, async (req, res) => {
    const {content, options, type, theme, level} = req.body
    let question = new Question()
    question.content = content
    question.type = type
    question.theme = theme
    question.level = level
    var arrOption = [];
    for (const option of options) {
        console.log(option)
        let data = new Option({content: option.content, is_correct: option.is_correct})
        data.question = question._id
        await data.save()
        arrOption.push(data._id)
    }
    question.options = arrOption
    await question.save()
    res.send({
        status  : true,
        message : "Create question successful",
        // data    : result
    })
})

router.post("/create_exercise", auth, async (req, res) => {
    const {name, course, type, level, theme, questions} = req.body
    let exercise = new Exercise()
    exercise.name = name
    exercise.course = course
    exercise.type = type
    exercise.level = level
    exercise.questions = questions
    await exercise.save()
    res.send({
        status  : true,
        message : "Create exercise successful",
        // data    : exercise
    })
})


router.get("/:id_exercise", auth, async (req, res) => {
    const id_exercise = req.params.id_exercise
    const exercise = await Exercise.findOne({_id: id_exercise})
                    .populate({
                        path: "questions",
                        populate: {
                            path: "options",
                            select: "_id content"
                        },
                        select: "-level"
                    }).select("-course")
    res.send({
        status  : true,
        message : null,
        data    : exercise
    })
})

module.exports = router;