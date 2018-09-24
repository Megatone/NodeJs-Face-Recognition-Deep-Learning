
const mongoose = require('mongoose');
const controller = require('./controllers/faceDescriptorController');

function connect(callback) {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/recognition',{ useNewUrlParser: true }).then(() => {
        console.log('Application database connection with Mongo are be success');
        callback();
    }).catch(err => {
        c.danger(err)
    });
}

module.exports = {
    connect,
    controller
};