const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "")
    const data = jwt.verify(token, process.env.JWT_KEY)
    const user = await User.findOne({_id : data._id, 'tokens.token': token})
    if (!user) {
        throw new Error("Invalid Token")
    }
    req.user = user
    req.token = token
    next()
}
module.exports = auth