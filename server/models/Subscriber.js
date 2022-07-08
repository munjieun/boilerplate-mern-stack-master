const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const SubscriberSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'USer'
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'USer'
    }

}, { timestamps: true }) // 만든 날짜와 업데이트한 날짜가 표시됨

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

module.exports = { Subscriber }