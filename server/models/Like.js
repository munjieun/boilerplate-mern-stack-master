const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const LikeSchema = mongoose.Schema({
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

const Like = mongoose.model('Like', LikeSchema);

module.exports = { Like }