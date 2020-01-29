const mongoose = require("mongoose");
require("dotenv").config();
const mongoDBErrors = require("mongoose-mongodb-errors");
mongoose.Promise = global.Promise;
try {
    mongoose.connect(process.env.MONGOURI, {useUnifiedTopology: true, useNewUrlParser: true,  useCreateIndex: true,});
    mongoose.plugin(mongoDBErrors);
} catch (err) {
    console.log(err);
}
console.log(process.env.MONGOURI);
// console.log(process.env.NAME);
// mongoose.connect()