const express = require("express");
require("express-async-errors");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
//database
require("./mongo")
//models
require("./models/Post")
require("./models/Comment")
require("./models/User")
require("./models/Course")

//middleware
app.use(bodyParser.json())
app.use(morgan())

//routes
app.use("/posts", require("./routes/posts"))
app.use("/users", require("./routes/users"))
app.use("/theory", require("./routes/courses"))

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