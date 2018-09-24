'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FaceDescriptorSchema = Schema({
    className: String,
    faceDescriptors: Array
});

module.exports = mongoose.model('FaceDescriptor', FaceDescriptorSchema);   