const router = require("express").Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const Result = mongoose.model("Result")

router.post("/rank_result", auth, async (req, res) => {
    const {offset, limit, id_exercise} = req.body
    const list_result = await Result.find({exercise: id_exercise}).sort({point: -1, time: 1})
                        .populate({
                            path: "user",
                            select: "_id name email img_avatar"
                        })
                        .select("user point time")
                        .skip(offset).limit(limit)
    res.send({
        status  : true,
        message : null,
        data    : list_result
    })
})

router.post("/history_date_make_exercise", auth, async (req, res) => {
    const {month, year} = req.body
    console.log(month)
    console.log(year)
    const user_id = req.user._id
    // const dateInMoth = new Date(year, month, 0).getDate();
    const fromDate = new Date(year, month - 1, 2);
    const toDate = new Date(year, month, 1);
    const list_date = await Result.find({$and : [{user: user_id}, {created_at: {
        "$gte": fromDate,
        "$lte": toDate
    }}]}).select("created_at")
    var list_result = [];
    list_date.forEach(function(item) {
        // const date = new Date(item).getDate()
        if (list_result.indexOf(item.created_at.getDate()) == -1){
            list_result.push(item.created_at.getDate())
        }
    })
    res.send({
        status  : true,
        message : null,
        data    : list_result
    })
})

router.post("/list_result", auth, async (req, res) => {
    const {offset, limit, id_course, type} = req.body
    const results = await Result.find({$and : [{user: req.user._id}, {type: type}, {course: id_course}]}).skip(offset).limit(limit)
    res.send({
        status  : true,
        message : null,
        data    : results
    })
})

router.post("/list_result_competition", auth, async (req, res) => {
    const {offset, limit, id_course, type} = req.body
    var results = []
    if (type == "") {
        results = await Exercise.find({$and : [{course: id_course}, {$or: [{type: "middle"}, {type: "end"}]}, {user: req.user._id}]}).skip(offset).limit(limit)
    } else {
        results = await Exercise.find({$and : [{course: id_course}, {type: type}, {user: req.user._id}]}).skip(offset).limit(limit)
    }
    res.send({
        status  : true,
        message : null,
        data    : results
    })
})


module.exports = router;