const User = require('../models/user')
const jwt = require('jsonwebtoken')

const checkAuth = async (req, res, next) => {
    try{
        const token = req.cookies.jwtToken
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token })
        if(user){
            return res.redirect('/chat');
        }
        next()
    }catch (e){
        next()
    }
}


module.exports = checkAuth