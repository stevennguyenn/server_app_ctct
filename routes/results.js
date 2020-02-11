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

module.exports = router;