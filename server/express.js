'use strict';

// Express Server
var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('error-handler'),
    morgan = require('morgan'),
    https = require('https'),
    path = require('path'),
    request = require('request'),
    flickrAPI = require('./externalAPI/flickrAPI'),
    formValidator = require('./util/formValidator'),
    app = express();

//Express Server Path Config settings
var serverConfig = {
    baseURL: 'dist',
    port: 5000
};

//Express Server configuration

/**
 * Morgan options: dev, combined, common
 */
app.use(morgan('common'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(serverConfig.baseURL));


app.get('/photos', function (req, res) {

  //Initial load with empty string
  var tags = '';

  if (!formValidator.hasValidFlickrAPIParams(tags)) {
     return res.send("Error invalid tag parameter");
  }

  //Calls external Flickr API public feed to fetch all photos
  flickrAPI.getFlickrPhotosByParams(tags, function (error, data){
    if(error){
      res.send(error);
    }
    res.json(data);
  });

});

app.post('/photos', function (req, res) {

  var tags = req.body.tags;

  if (!formValidator.hasValidFlickrAPIParams(tags)) {
     return res.send("Error invalid tag parameter");
  }

  //Calls external Flickr API public feed to fetch all photos by user supplied tags
  flickrAPI.getFlickrPhotosByParams(tags, function (error, data){
    if(error){
      res.send(error);
    }
    res.json(data);
  });

});

app.listen(serverConfig.port);
console.log("Express Server listening on port: " + serverConfig.port)