const jwt = require('jsonwebtoken')
const User = require('../models/user/User')

const admin = async (req, res, next) => {
    // console.log("Author" + req.headers.authorization)
    // console.log(req.header("Authorization"))
    const token = req.header("Authorization").replace("Bearer ", "")
    // console.log(token)
    const data = jwt.verify(token, process.env.JWT_KEY)
    console.log(data)
    const user = await User.findOne({_id : data._id, 'token': token})
    if (!user) {
        throw new Error("Invalid Token")
    }
    if (!user.is_admin) {
        throw new Error("Invalid authority")
    }
    req.user = user
    req.token = token
    next()
}
module.exports = admin