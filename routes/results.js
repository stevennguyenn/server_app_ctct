const router = require("express").Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const Result = mongoose.model("Result")
const User = mongoose.model("User")
const Comment = mongoose.model("Comment")
var ObjectID = require("mongodb").ObjectID

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
    const results = await Result.find({$and : [{user: req.user._id}, {type: type}, {course: id_course}]}).skip(offset).limit(limit).select("_id created_at name point time")
    res.send({
        status  : true,
        message : null,
        data    : results
    })
})

router.post("/top_point_user", auth, async (req, res) => {
    const {id_user} = req.body
    const results = await Result.find({user: id_user}).sort({point : -1, time: 1}).select("_id created_at name point time course").limit(10).populate({path : "course", select : "name"});
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
        results = await Result.find({$and : [{course: id_course}, {$or: [{type: "middle"}, {type: "end"}]}, {user: req.user._id}]}).skip(offset).limit(limit).select("_id created_at name point time")
    } else {
        results = await Result.find({$and : [{course: id_course}, {type: type}, {user: req.user._id}]}).skip(offset).limit(limit).select("_id created_at name point time")
    }
    res.send({
        status  : true,
        message : null,
        data    : results
    })
})

router.get("/:id_result", auth, async (req, res) => {
    const id_result = req.params.id_result
    const result = await Result.findOne({_id: id_result})
    res.send({
        status  : true,
        message : null,
        data    : result
    })
})

router.post("/top_point", async (req, res) => {
    const {offset, limit, id_course} = req.body;
    console.log(id_course)
    if (id_course == null) {
        const result = await Result.aggregate([
            { $group: 
                { _id : "$user", point : { $sum: "$point" }, time: { $sum: "$time"}}
            }])
            .sort({point: -1, time: 1})
            .skip(offset).limit(limit)
        await User.populate(result, {path: "_id", select: "name img_avatar"})
        res.send({
            status  : true,
            message : null,
            data    : result
        })
    } else {
        const result = await Result.aggregate([
            {
                $match: {
                    "course" : ObjectID(id_course)
                }
            },
            { $group: 
                { _id : "$user", point : { $sum: "$point" }, time: { $sum: "$time"}}
            }])
            .sort({point: -1, time: 1})
            .skip(offset).limit(limit)
        await User.populate(result, {path: "_id", select: "name img_avatar"})
        res.send({
            status  : true,
            message : null,
            data    : result
        })
    }
})

router.post("/comments", auth, async (req, res) => {
    // const id_user = req.user._id;
    const {id_question, offset, limit} = req.body
    const comments = await Comment.find({$and : [{question: id_question}, {is_parent: true}]})
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
                        }).skip(offset).limit(limit)
    res.send({
        status  : true,
        message : "Successful",
        data: comments
    })
})

router.post("/add_comment", auth, async (req, res) => {
    const id_user = req.user._id;
    const {id_question, id_parent, content} = req.body
    const comment = new Comment()
    comment.user = id_user
    comment.content = content
    comment.question = id_question
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
    const commentPopulate = await Comment.populate(comment, {path: "user", select: "_id name email"})
    res.send({
        status  : true,
        message : "Successful",
        data    : commentPopulate
    })
})

module.exports = router;