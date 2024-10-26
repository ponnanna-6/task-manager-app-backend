const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessList: [
        { type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    emailList: [
        { type: String }
    ],
});

const BoardModel = mongoose.model('Board', BoardSchema);
module.exports = BoardModel;
