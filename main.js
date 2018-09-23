'use strict';
const recognitionModule = require('./recognitionModule')();
const cv = recognitionModule.cv;
const fr = recognitionModule.fr;
const puertoCam = 0;


runVideoFaceDetection();

function runVideoFaceDetection() {
    const webcam = new cv.VideoCapture(puertoCam);
    const win = new fr.ImageWindow();   
    while (true) {    
        let frame = webcam.read();
        if (frame.empty === false) {
            frame = frame.resizeToMax(800);
            let facesDetected = recognitionModule.detectFaces(frame);
            facesDetected.forEach((faceDetectedRect) => {
                frame = recognitionModule.recognizeFace(frame, faceDetectedRect, 0.5);
            });
            win.clearOverlay();
            win.setImage(fr.CvImage(frame));
        } else {
            process.exit();
            break;
        }
    }
    process.exit();
}






