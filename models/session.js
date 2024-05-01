// models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        // type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true, versionKey: false });

const Session = mongoose.model('session', sessionSchema);

module.exports = Session;
