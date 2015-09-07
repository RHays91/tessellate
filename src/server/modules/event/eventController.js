var sendResp = require('../../config/helpers').sendResponse,
    dB       = require('../../db/db'),
    mapmaker = require('../../db/mapmaker'),
    cloudinary = require('../cloudinary/cloudinary.controller.js');

module.exports = {

  findEvent: function (req, res){
    var eventCode = req.body.eventCode;
    dB.Event.findOne({eventCode: eventCode}, function(err, event){
      if (err){
        console.log(err);
      }
      if (event){
        sendResp(res, {event: event}, 200);
      } else {
        sendResp(res, {event: false}, 404);
      }
    });
  },

  createEvent: function (req, res){
    // console.log(req);
    console.log(req.file);
    console.log(req.file.path);
    var eventCode = req.body.eventCode;
    console.log(eventCode + " is our event code");
    dB.Event.findOne({eventCode: eventCode}, function(err, event){
      if (err){
        console.log(err);
      }
      if (event){
        sendResp(res, {event: false});
      } else {
        cloudinary.postImages(req, res, function(result){
          console.log(result.url + " is the result we got back!");
          mapmaker.saveEventAndMap("mack", result.url, eventCode, function(returnObj){
            res.json(returnObj);
            sendResp(res);
          });
        });
      }
    });
  }
};