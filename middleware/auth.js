const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
    // console.log("Author" + req.headers.authorization)
    // console.log(req.header("Authorization"))
    console.log(req.header)
    const token = req.header("Authorization").replace("Bearer ", "")
    console.log(token)
    const data = jwt.verify(token, process.env.JWT_KEY)
    const user = await User.findOne({_id : data._id, 'token': token})
    if (!user) {
        throw new Error("Invalid Token")
    }
    req.user = user
    req.token = token
    next()
}
module.exports = auth