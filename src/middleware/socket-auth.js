const User = require('../models/user')
const jwt = require('jsonwebtoken')

const socketAuth = async (socket) => {
    try{
        const token = parseCookies(socket.request).jwtToken
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token })
        if(!user){
            throw new Error()
        }
        socket.token = token
        socket.user = user
    }catch (e) {
        throw new Error()
    }
}

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

module.exports = socketAuth
