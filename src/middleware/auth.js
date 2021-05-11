const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try{
        const token = req.cookies.jwtToken
        if(typeof token === 'undefined'){
            res.redirect('/login')
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token })
        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    }catch (e){
        res.status(401).send({error: 'Unauthorized Access'})
    }
}


module.exports = auth