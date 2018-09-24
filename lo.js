var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const recognitionModule = require('./recognitionModule')();
const cv = recognitionModule.cv;
const puertoCam = 0;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
    runVideoFaceDetection();
});

function runVideoFaceDetection() {
    const webcam = new cv.VideoCapture(puertoCam);  
    setInterval(() => {
        let frame = webcam.read();
        if (frame.empty === false) {
            frame = frame.resizeToMax(800);
            let facesDetected = recognitionModule.detectFaces(frame);
            facesDetected.forEach((faceDetectedRect) => {
                frame = recognitionModule.recognizeFace(frame, faceDetectedRect);
            });
            io.emit('img', { base64: recognitionModule.matToBase64(frame) });        }
    }, 16);
} 