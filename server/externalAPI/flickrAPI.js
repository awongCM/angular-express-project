'use strict';

var request = require('request');
var jsonHelper = require('./../util/jsonHelper');

//Configuration
var flickrPublicFeedAPI = {
    uri: 'https://api.flickr.com/services/feeds/photos_public.gne',
    qs: {
      tags: '',
      format: 'json',
    }
};

var getFlickrPhotosByParams = function (tags, callback) {

  flickrPublicFeedAPI.qs.tags = tags;

  request.get(flickrPublicFeedAPI, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      try {
        var json = jsonHelper.parseFeeds(body);
        var photos = json.items;
        callback(null, photos);
      }
      catch (e) {
        callback(new Error('Flickr public feed API parse error: ' + e.message));
      }
    }
    else {
      callback(new Error('Flickr public feed API error'));
    }
  });
};

module.exports = {
  getFlickrPhotosByParams: getFlickrPhotosByParams
};