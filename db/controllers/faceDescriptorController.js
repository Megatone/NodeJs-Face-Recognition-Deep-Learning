var FaceDescriptor = require('../models/faceDescriptor');

function upsertFaceDescriptor(_faceDescriptor, callback) {
    FaceDescriptor.findOne({ className: _faceDescriptor.className }, (err, faceDescriptorFinded) => {
        if (err) {
            console.log('error' + err);
        }
        if (!faceDescriptorFinded) {
            FaceDescriptor.update({ className: _faceDescriptor.className }, { faceDescriptors: _faceDescriptor.faceDescriptors }, { upsert: true }, (err, objUpdated) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('INSERT Muestras registradas  para ' + _faceDescriptor.className);
                    callback();
                }
            });
        } else {
            faceDescriptorFinded.faceDescriptors.push(_faceDescriptor.faceDescriptors[0]);
            FaceDescriptor.findOneAndUpdate({ className: _faceDescriptor.className }, { faceDescriptors: faceDescriptorFinded.faceDescriptors }, { upsert: true }, (err, objUpdated) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('UPDATE Muestras registradas  para ' + _faceDescriptor.className);
                    callback();
                }
            });
        }
    });
}

function getFaceDescriptors(callback) {
    FaceDescriptor.find({}, { __v: 0, _id: 0 }, (err, faceDescriptors) => {
        callback(faceDescriptors);
    });
}

module.exports = {
    upsertFaceDescriptor,
    getFaceDescriptors
}