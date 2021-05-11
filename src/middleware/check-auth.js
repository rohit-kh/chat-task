const checkAuth = async (req, res, next) => {
    try{
        if(typeof req.cookies.jwtToken === 'undefined'){
            return next()
        }
        const token = req.cookies.jwtToken

        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token })
        if(user){
            res.redirect('/rooms/select');
        }
        next()
    }catch (e){
        res.status(401).send({error: 'Unauthorized Access'})
    }
}


module.exports = checkAuth