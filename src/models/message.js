const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true,
        trim: true
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // author: { type: Schema.Types.ObjectId, ref: 'Person' },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    }
},
{
    timestamps: true
})


const Message = mongoose.model('Message', messageSchema)

module.exports = Message