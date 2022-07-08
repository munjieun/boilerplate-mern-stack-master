const express = require('express');
const router = express.Router();

const { Comment } = require("../models/Comment");


//=================================
//          Comment
//=================================


router.post('/saveComment', (req, res) => {
    
    const comment = new Comment(req.body);

    comment.save((err, comment) => {
        if (err) return res.json({ success: false, err })

        // save 후 가져온 comment에서 바로 populate을 사용하지 못하기 때문에 가져온 데이터의 id를 사용해서 Comment 객체에서 writer 정보를 찾는다.
        Comment.find({ '_id': comment._id })
        .populate('writer')
        .exec((err, result) => {
            if (err) return res.json({ success: false, err })
            res.status(200).json({ success: true, result })
        })
    })

});

router.post('/getComments', (req, res) => {
    
    Comment.find({ "postId" : req.body.videoId })
    .populate("writer")
    .exec((err, comments) => {
        if (err) return res.status(400).send(err)
        res.status(200).json({ success: true, comments })
    })

});

module.exports = router;