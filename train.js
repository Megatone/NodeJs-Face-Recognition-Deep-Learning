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
let count = 0;


rl.question('¿What is your name? ', (answer) => {
    rl.close();
    recognitionModule.initialize(() => {
        const webcam = new cv.VideoCapture(puertoCam);
        const win = new fr.ImageWindow();
        setInterval(() => {
            if (count === 50) {
                process.exit();
            }
            let frame = webcam.read();
            if (frame.empty === false) {
                frame = frame.resizeToMax(800);
                let facesDetected = recognitionModule.detectFaces(frame);
                facesDetected.forEach((faceDetectedRect) => {
                    let frameDetected = frame.getRegion(faceDetectedRect).resize(150, 150);
                    frame.drawRectangle(faceDetectedRect, cv.Vec(255, 0, 0), 2, cv.LINE_AA);
                    recognitionModule.saveFaceDescriptor(answer, frameDetected, () => {
                        count = count + 1;
                    });

                });
                win.setImage(fr.CvImage(frame));
            }
        }, 16);
    });
});

