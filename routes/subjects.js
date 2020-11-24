const router = require("express").Router()
const mongoose = require("mongoose")
const Subject = mongoose.model("Subject")
const UserJoinSubject = mongoose.model("UserJoinSubject")
var ObjectID = require("mongodb").ObjectID

router.get("/", async (req, res) => {
    const userId = req.query.user_id
    const subjects = await Subject.find({})
    var listSubjectUserJoin = []
    if (userId != "" && userId != null) {
        const resultUserJoinSubject = await UserJoinSubject.find({user: ObjectID(userId)})
        listSubjectUserJoin = resultUserJoinSubject.map(function(e) {
            return e.subject
        })
    }
    var statusJoin = []
    for (const item in subjects) {
        if (userId == "" || userId == null) {
            statusJoin.push(0)
            continue
        }
        if (listSubjectUserJoin.includes(item._id)) {
            statusJoin.push(2)
        } else {
            statusJoin.push(1)
        }
    }
    res.send({
        status  : true,
        message : null,
        data    : {
            "subjects": subjects,
            "status_join": statusJoin
        }
    })
})

module.exports = router;

