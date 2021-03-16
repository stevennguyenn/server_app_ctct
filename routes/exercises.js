const router = require("express").Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const Exercise = mongoose.model("Exercise")
const Question = mongoose.model("Question")
const Result = mongoose.model("Result")

router.post("/list_exercise", auth, async (req, res) => {
    const {offset, limit, id_course, type} = req.body
    const exercises = await Exercise.find({$and : [{course: id_course}, {type: type}]}).skip(offset).limit(limit).select("-questions -course")
    res.send({
        status  : true,
        message : null,
        data    : exercises
    })
})

router.post("/list_exercise_competition", auth, async (req, res) => {
    const {offset, limit, id_course, type} = req.body
    var exercises = []
    if (type == "") {
        exercises = await Exercise.find({$and : [{course: id_course}, {$or: [{type: "middle"}, {type: "end"}]}]}).skip(offset).limit(limit).select("-questions -course")
    } else {
        exercises = await Exercise.find({$and : [{course: id_course}, {type: type}]}).skip(offset).limit(limit).select("-questions -course")
    }
    res.send({
        status  : true,
        message : null,
        data    : exercises
    })
})

router.post("/create_question", auth, async (req, res) => {
    const {content, options, type, theme, level, answer} = req.body
    let question = new Question()
    question.content = content
    question.type = type
    // question.theme = theme
    question.level = level
    question.answer = answer
    var arrOption = [];
    var i = 1;
    for (const option of options) {
        console.log(option)
        let data = {"content": option.content, "is_correct": option.is_correct, "_id" : i}
        arrOption.push(data)
        i += 1
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
    const {name, course, type, level, theme, questions, time} = req.body
    let exercise = new Exercise()
    exercise.name = name
    exercise.course = course
    exercise.type = type
    exercise.level = level
    exercise.questions = questions
    exercise.time = time
    exercise.theme = theme
    await exercise.save()
    res.send({
        status  : true,
        message : "Create exercise successful",
        // data    : exercise
    })
})


// router.post("/add_exercise", auth, async (req, res) => {
//     const {name, id_course, type, level, theme, time} = req.body
//     const exercise = new Exercise()
//     exercise.name = name
//     exercise.course = id_course
//     exercise.type = type
//     exercise.level = level
//     exercise.time = time
//     exercise.theme = theme
//     await exercise.save()
//     res.send({
//         status  : true,
//         message : null,
//         data    : exercise
//     })
// })

router.get("/:id_exercise", auth, async (req, res) => {
    const id_exercise = req.params.id_exercise
    const exercise = await Exercise.findOne({_id: id_exercise})
                    .populate({
                        path: "questions",
                        select: "-options.is_correct -answer"
                    }).select("-course")
    res.send({
        status  : true,
        message : null,
        data    : exercise
    })
})


router.post("/submit_exercise", auth, async (req, res) => {
    const {id_exercise, answer, time} = req.body
    const exercise = await Exercise.findOne({_id: id_exercise}).populate("questions")
    var point = 0
    const list_question = exercise.questions
    var result_questions = [];
    for (var i = 0; i < list_question.length; i ++) {
        var userAnswer = {};
        userAnswer["content"] = list_question[i].content
        userAnswer["options"] = list_question[i].options
        userAnswer["type"] = list_question[i].type
        userAnswer["level"] = list_question[i].level
        userAnswer["user_answer"] = answer[i].answer
        if (list_question[i].type == "fill") {
            console.log(list_question[i])
            if (answer[i].answer == list_question[i].answer) {
                point += 1
                userAnswer["is_correct"] = true
                continue
            }
            userAnswer.answer = list_question[i].answer
        } else {
            for (const option of list_question[i].options) {
                if (option.is_correct == true) {
                    userAnswer.answer = option._id
                    if (option.id == answer[i].answer) {
                        point += 1
                        userAnswer["is_correct"] = true
                        continue
                    }
                }
            }
        }
        result_questions.push(userAnswer)
    }
    const result = new Result()
    result.name = exercise.name
    result.type = exercise.type
    result.user = req.user._id
    result.course = exercise.course
    result.exercise = exercise._id
    result.point = point
    result.time = time
    result.level = exercise.level
    result.diamond = point * 10;
    result.experience = point * 100;
    result.result_questions = result_questions
    await result.save()
    exercise.user.push(req.user._id)
    await exercise.save()
    res.send({
        status  : true,
        message : null,
        data    : result
    })
})

//for admin
router.get("/admin/all_exercise", async (req, res) => {
    const offset = Number(req.query.offset);
    const limit = Number(req.query.limit);
    const resultPage = await Exercise.countDocuments({})
    const page = parseInt(resultPage / limit, 10) + 1;
    const theories = await Exercise.find({})
        .populate({
            path: "questions",
            select: "-options -theory"
        }).select("-course -user -theory")
      .skip(offset)
      .limit(limit);
    res.send({
      status: true,
      message: null,
      meta: {
        "page": page
      },
      data: theories,
    });
  });

  //for admin
router.post("/admin/create", async (req, res) => {
    const {
        name,
        course,
        theory,
        type,
        time,
        number
    } = req.body
    const exercise = Exercise()
    exercise.name = name
    exercise.course = course
    exercise.theory = theory
    exercise.type = type
    exercise.time = time
    console.log("recive")
    // const questions = await Question.aggregate([
    //     {$match: {theory: {"$in" : theory}}},
    //     {$sample: {size: number}}
    // ])
    // const questions = await Question.aggregate([
    //     {$sample: {size: number}},
    //     {$match: {"5e9184291c9d440000965378": {"$in" : theories}}}

    // ])
    const questions = await Question.find({theory: {"$in" : theory}}).limit(number)
    exercise.questions = questions.map((e) => e._id)
    await exercise.save()
    res.send({
      status: true,
      message: null,
      data: questions,
    });
  });

module.exports = router