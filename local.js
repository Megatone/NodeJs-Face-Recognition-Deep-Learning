'use strict';
const recognitionModule = require('./recognitionModule')();
const cv = recognitionModule.cv;
const fr = recognitionModule.fr;
const puertoCam = 0;
const webcam = new cv.VideoCapture(puertoCam);
const win = new fr.ImageWindow();

recognitionModule.initialize(() => {
    setInterval(() => {
        let frame = webcam.read();
        if (frame.empty === false) {
            frame = frame.resizeToMax(800);
            let facesDetected = recognitionModule.detectFaces(frame);
            facesDetected.forEach((faceDetectedRect) => {           
                frame = recognitionModule.recognizeFace(frame, faceDetectedRect);
            });
            win.clearOverlay();
            win.setImage(fr.CvImage(frame));
        } else {
            process.exit();
        }
    }, 16);
});