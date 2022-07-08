const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const DislikeSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'USer'
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }

}, { timestamps: true }) // 만든 날짜와 업데이트한 날짜가 표시됨

const DisLike = mongoose.model('DisLike', DislikeSchema);

module.exports = { DisLike }