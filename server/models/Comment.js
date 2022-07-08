const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }

}, { timestamps: true }) // 만든 날짜와 업데이트한 날짜가 표시됨

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = { Comment }