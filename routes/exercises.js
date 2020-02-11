const router = require("express").Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const Exercise = mongoose.model("Exercise")
const Question = mongoose.model("Question")
const Option = mongoose.model("Option")
const Result = mongoose.model("Result")
const ResultQuestion = mongoose.model("ResultQuestion")

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
    const {name, id_course, type, level, theme, time} = req.body
    const exercise = new Exercise()
    exercise.name = name
    exercise.course = id_course
    exercise.type = type
    exercise.level = level
    exercise.time = time
    // exercise.theme = theme
    await exercise.save()
    res.send({
        status  : true,
        message : null,
        data    : exercise
    })
})

router.post("/create_question", auth, async (req, res) => {
    const {content, options, type, theme, level, answer} = req.body
    let question = new Question()
    question.content = content
    question.type = type
    question.theme = theme
    question.level = level
    question.answer = answer
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


router.post("/submit_exercise", auth, async (req, res) => {
    const {id_exercise, answer, time} = req.body
    const exercise = await Exercise.findOne({_id: id_exercise})
                    .populate({
                        path: "questions",
                        populate: {
                            path: "options"
                        }
                    })
    var point = 0
    const list_question = exercise.questions
    var result_questions = [];
    for (var i = 0; i < list_question.length; i ++) {
        const userAnswer = new ResultQuestion();
        userAnswer.content = list_question[i].content
        userAnswer.options = list_question[i].options
        userAnswer.type = list_question[i].type
        userAnswer.level = list_question[i].level
        userAnswer.user_answer = answer[i].answer
        // console.log(list_question[i].type)
        if (list_question[i].type == "fill") {
            console.log(list_question[i])
            if (answer[i].answer == list_question[i].answer) {
                point += 1;
                userAnswer.is_correct = true
                continue;
            }
            // console.log(list_question[i].answer)
            userAnswer.answer = list_question[i].answer
        } else {
            for (const option of list_question[i].options) {
                if (option.is_correct == true) {
                    userAnswer.answer = option._id
                    // console.log(option._id)
                    if (option.id == answer[i].answer) {
                        point += 1;
                        userAnswer.is_correct = true
                        continue;
                    }
                }
            }
        }
        // userAnswer.answer = "dadasdsa"
        // console.log(userAnswer.answer)
        result_questions.push(userAnswer._id);
        await userAnswer.save()
    }
    const result = new Result()
    result.name = exercise.name
    result.user = req.user._id
    result.exercise = exercise._id
    result.point = point
    result.time = time
    result.diamond = point * 10;
    result.experience = point * 100;
    result.result_questions = result_questions
    await result.save()
    const resultFull = await Result.findOne({_id: result._id}).populate({
        path: "result_questions",
        populate: {
            path: "options"
        }
    })
    res.send({
        status  : true,
        message : null,
        data    : resultFull
    })
})

module.exports = router;