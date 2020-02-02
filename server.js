const express = require("express")
require("express-async-errors")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")

//database
require("./mongo")
//models
require("./models/CommentTheory")
require("./models/User")
require("./models/Course")
require("./models/Theory")
require("./models/LikeTheory")
require("./models/Image")

//middleware
app.use(bodyParser.json())
app.use(morgan())

//routes
app.use("/users", require("./routes/users"))
app.use("/theories", require("./routes/theories"))
app.use("/upload", require("./routes/upload"))
app.use(express.static(__dirname));

//not found router 
app.use((req, res, next) => {
    req.status = 404;
    const error = new Error("URL not found");
    next(error);
})

//errors handler
if (app.get("env") == "production") {
    app.use((error, req, res, next) => {
        res.status(req.status || 500).send({
            status  : false,
            message: error.message
        })
    })
} else {
    app.use((error, req, res, next) => {
        res.status(req.status || 500).send({
            status  : false,
            message: error.message,
            stack: error.stack
        })
    })
}

app.listen(process.env.PORT, function() {
    console.log("Server listion port " + process.env.PORT);
})