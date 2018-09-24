'use strict';
module.exports = () => {
    const db = require('./db/db');
    const cv = require('opencv4nodejs');
    const fr = require('face-recognition').withCv(cv);
    const filter = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);
    const recognizer = fr.FaceRecognizer();

    function saveFaceDescriptor(name, face, callback) {
        let _face = fr.cvImageToImageRGB(fr.CvImage(face));
        const recognizer2 = new fr.FaceRecognizer();
        recognizer2.addFaces([_face], name);
        db.controller.upsertFaceDescriptor(recognizer2.serialize()[0], callback);
    }

    return {
        cv: cv,
        fr: fr,
        initialize: (callback) => {
            db.connect(() => {
                db.controller.getFaceDescriptors(function (faceDescriptors) {
                    recognizer.load(faceDescriptors);
                    callback();
                });
            });
        },
        detectFaces: (imagen) => {
            const facesDetected = filter.detectMultiScaleGpu(imagen.bgrToGray(), {
                minSize: new cv.Size(100, 100),
                scaleFactor: 1.2,
                minNeighbors: 10
            }).objects;
            return facesDetected;
        },
        matToBase64: function (mat) {
            return 'data:image/jpeg;base64,' + cv.imencode('.jpg', mat).toString('base64');
        },
        saveFaceDescriptor: saveFaceDescriptor,
        recognizeFace: (frame, faceDetectedRect, feedDeepLearningFaceRecognition = 0.1) => {
            let frameDetected = frame.getRegion(faceDetectedRect).resize(150, 150);
            let faceDetected = fr.CvImage(frameDetected);
            const prediction = recognizer.predictBest(faceDetected, 0.5);
            if (prediction.distance < feedDeepLearningFaceRecognition) {
                saveFaceDescriptor(prediction.className, frameDetected, () => { });
            }
            frame.drawRectangle(faceDetectedRect, cv.Vec(255, 0, 0), 2, cv.LINE_AA);
            let percent = parseInt((100 - (prediction.distance * 100)));
            let label = (prediction.className + ' - ' + percent + '%').toUpperCase();
            let positionLabel = new cv.Point(faceDetectedRect.x, faceDetectedRect.y - 10);
            let color = cv.Vec(0, 255, 0);
            frame.putText(label, positionLabel, cv.FONT_HERSHEY_PLAIN, 1.3, color, 1);
            return frame;
        },
    };
};