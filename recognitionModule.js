'use strict';
module.exports = () => {
    const path = require('path');
    const fs = require('fs')
    const cv = require('opencv4nodejs');
    const fr = require('face-recognition').withCv(cv);
    const appdataPath = path.resolve(__dirname, './appdata');
    const trainedModelFilePath = path.resolve(appdataPath, 'faceRecognition2Model_150.json');
    const facesPath = path.resolve(path.resolve('./data'), 'faces')
    const classNames = ['unknown'];
    const filter = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);
    const recognizer = fr.FaceRecognizer();

    if (!fs.existsSync(path.resolve('./data'))) {
        fs.mkdirSync(path.resolve('./data'));
    }

    if (!fs.existsSync(facesPath)) {
        fs.mkdirSync(facesPath);
    }

    if (!fs.existsSync(appdataPath)) {
        fs.mkdirSync(appdataPath);
    }

    if (!fs.existsSync(trainedModelFilePath)) {
        const allFiles = fs.readdirSync(facesPath)
        const imagesByClass = classNames.map(c =>
            allFiles
                .filter(f => f.includes(c))
                .map(f => path.join(facesPath, f))
                .map(fp => {
                    return fr.cvImageToImageRGB(fr.CvImage(cv.imread(fp)));
                })
        )

        imagesByClass.forEach((faces, label) => {
            recognizer.addFaces(faces, classNames[label]);
        });

        fs.writeFileSync(trainedModelFilePath, JSON.stringify(recognizer.serialize()));
    } else {
        recognizer.load(require(trainedModelFilePath));
    }


    return {
        cv: cv,
        fr: fr,  
        detectFaces: (imagen) => {
            const facesDetected = filter.detectMultiScaleGpu(imagen.bgrToGray(), {
                minSize: new cv.Size(100, 100),
                scaleFactor: 1.2,
                minNeighbors: 10
            }).objects;
            return facesDetected;
        },
        recognizeFace: (frame, faceDetectedRect, feedDeepLearningFaceRecognition = 0.1) => {
            let frameDetected = frame.getRegion(faceDetectedRect).resize(150, 150);
            let faceDetected = fr.CvImage(frameDetected);
            const prediction = recognizer.predictBest(faceDetected, 0.5);
            if (prediction.distance < feedDeepLearningFaceRecognition) {
                cv.imwrite(facesPath + '/' + prediction.className + Math.floor(Date.now() / 1000) + '.jpg', frameDetected);
            }

            frame.drawRectangle(faceDetectedRect, cv.Vec(255, 0, 0), 2, cv.LINE_AA);
            let percent = parseInt((100 - (prediction.distance * 100)));
            let label = (prediction.className + ' - ' + percent+ '%').toUpperCase();
            let positionLabel = new cv.Point(faceDetectedRect.x, faceDetectedRect.y - 10);
            let color = cv.Vec(0, 255, 0);
            frame.putText(label, positionLabel, cv.FONT_HERSHEY_PLAIN, 1.3, color , 1);
            return frame;
        }
    };
};