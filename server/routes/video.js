const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
let ffmpeg = require("fluent-ffmpeg");
const { Subscriber } = require('../models/Subscriber');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => { // 파일을 어디에 저장할지
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
    /*
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true);
    }*/
});

const fileFilter = (req, file, cb) => {
    // mime type 체크하여 원하는 타입만 필터링
    if (file.mimetype == 'video/mp4') {
    cb(null, true);
    } else {
        cb({msg:'mp4 파일만 업로드 가능합니다.'}, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter }).single("file");



//=================================
//             Video
//=================================

// 먼저 index.js 에서 /api/video를 읽고 routes/video.js로 오기 때문에 /api/video는 생략해도 된다.
router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename }); // url은 uploads 경로
    })
})

router.post('/thumbnail', (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임 가져오기

    let filePath = '';
    let fileDuration = '';
    
    // 비디오 정보 가져오기
    ffmpeg.setFfmpegPath('C:/Users/122002/vscode_workspace/ffmpeg-5.0.1-essentials_build/bin/ffmpeg.exe');
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata); // all metadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.url) // 클라이언트에서 온 비디오 경로 - /uploads
    .on('filenames', function(filenames) { // thumbnail 파일이름 생성
        console.log('Will generate ' + filenames.join(', '));
        console.log(filenames);

        filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function() { // thumbnail을 생성하고 난 후, 무엇을 할 것인지
        console.log('Screenshots taken');
        return res.json({ success: true, url: filePath, fileDuration: fileDuration });
    })
    .on('error', function(err) { // 에러가 났을 경우
        console.error(err);
        return res.json({ success: false, err });
    })
    .screenshots({ 
        // Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 3, // thumnail을 몇 개를 생성할 것인지 설정
        folder: 'uploads/thumbnails', // 해당 폴더에 썸네일 저장
        size: '320x240',
        //'%b': input basename (filename w/o extension), 익스텐션이 빠진 파일네임
        filename: 'thumbnail-%b.png'
    })
})

router.post('/uploadvideo', (req, res) => {
    // 비디오 정보들을 몽고DB에 저장한다.

    // req.body에는 클라이언트에서 보낸 모든 variables가 담기게 된다. (ex) req.body.writer 은 writer 정보만 가져옴
    const video = new Video(req.body);

    video.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
})

router.get('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.
    
    // find를 사용하면 video collection 안에 있는 모든 데이터를 가져온다.
    // populate을 써줘야 writer의 모든 정보를 가져온다. find만 사용하면 writer에서 id만 가져오게 된다.
    Video.find()
    .populate('writer') 
    .exec((err, videos) => {
        if (err) return res.status(400).send(err)
        res.status(200).json({ success: true, videos })
    })
})

router.post('/getVideoDetail', (req, res) => {

    Video.findOne({ "_id": req.body.videoId })
    .populate('writer') 
    .exec((err, videoDetail) => {
        if (err) return res.status(400).send(err)
        res.status(200).json({ success: true, videoDetail })
    })
})

router.post('/getSubscriptionVideos', (req, res) => {

    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom })
    .exec((err, subscriberInfo) => {
        if (err) return res.status(400).send(err);

        let subscribedUer = [];
        subscriberInfo.map((subscriber, i) => {
            subscribedUer.push(subscriber.userTo);
        })

        // 찾은 사람들의 비디오를 가지고 온다.
        // 여러 명일 때는 req.body.id로 못가져와서 몽고DB의 $in 명령어 사용
        Video.find({ writer: { $in: subscribedUer } })
        .populate('writer')
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
    }) 
})

module.exports = router;