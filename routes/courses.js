const router = require("express").Router()
const mongoose = require("mongoose")
const Course = mongoose.model("Course")
const UserJoinCourse = mongoose.model("UserJoinCourse")
var ObjectID = require("mongodb").ObjectID



router.get("/:$idSubject", async (req, res) => {
    const userId = req.query.user_id
    console.log(userId);
    const courses = await Course.find({id_subject: req.params.idSubject})
    var listCourseUserJoin = []
    if (userId != "" && userId != null) {
        const resultUserJoinCourse = await UserJoinCourse.find({user: ObjectID(userId)})
        listCourseUserJoin = resultUserJoinCourse.map(function(e) {
            return e.course
        })
    }
    var statusJoin = []
    for (const item in courses) {
        if (userId == "" || userId == null) {
            statusJoin.push(0)
            continue
        }
        if (listCourseUserJoin.includes(item._id)) {
            statusJoin.push(2)
        } else {
            statusJoin.push(1)
        }
    }
    res.send({
        status  : true,
        message : null,
        data    : {
            "courses": courses,
            "status_join": statusJoin
        }
    })
})

router.get("/all", async (req, res) => {
    const courses = await Course.find({})
    res.send({
        status  : true,
        message : null,
        data    : courses
    })
})


module.exports = router;

