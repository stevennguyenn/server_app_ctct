const router = require("express").Router()
const mongoose = require("mongoose")
const Post = mongoose.model("Post")
const Comment = mongoose.model("Comment")
const auth = require("../middleware/auth")

//posts
router.get("/:postId", async (req, res) => {
    console.log(req.params.postId);
    const post = await Post.findOne({_id : req.params.postId})
    res.send(post);
})

router.get("/", auth, async (req, res) => {
    console.log(req.params.postId);
    const posts = await Post.find({})
    res.send(posts);
})

router.put("/:postId", async (req, res) => {
    console.log(req.params.postId);
    const post = await Post.findByIdAndUpdate({
        _id: req.params.postId
    }, req.body, {
        new : true,
        runValidators : true,
    });
    res.send(post);
})

router.post("/", async (req, res) => {
    const post = new Post();
    post.device_id = req.body.device_id;
    post.language = req.body.language;
    await post.save(); 
    res.send(post)
})

//comment
router.post("/:postId/comment", async (req, res) => {
    const post = await Post.findOne({_id : req.params.postId});
    const comment = new Comment();
    comment.content = req.body.content;
    comment.post = post._id;
    await comment.save();
    post.comments.push(comment);
    await post.save();
    res.send(comment);
})

router.get("/:postId/comments", async (req, res) => {
    const post = await Post.findOne({_id : req.params.postId}).populate("comments");
    res.send(post);
})

module.exports = router;