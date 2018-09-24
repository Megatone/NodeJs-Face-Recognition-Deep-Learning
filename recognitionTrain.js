'use strict';
const recognitionModule = require('./recognitionModule')();
const readline = require('readline');
const cv = recognitionModule.cv;
const fr = recognitionModule.fr;
const puertoCam = 0;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let name = '';
rl.question('¿What is your name? ', (answer) => {  
    name = answer;
    rl.close();
    runVideoFaceDetection();
   
});

function runVideoFaceDetection() {
    const webcam = new cv.VideoCapture(puertoCam);
    const win = new fr.ImageWindow();
    while (true) {
        let frame = webcam.read();
        if (frame.empty === false) {
            frame = frame.resizeToMax(800);
            let facesDetected = recognitionModule.detectFaces(frame);
            facesDetected.forEach(faceDetectedRect => {
                let faceDetected = frame.getRegion(faceDetectedRect).resize(150, 150);
                recognitionModule.saveFace(name, faceDetected);
                frame.drawRectangle(faceDetectedRect, cv.Vec(255, 0, 0), 2, cv.LINE_AA);
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






