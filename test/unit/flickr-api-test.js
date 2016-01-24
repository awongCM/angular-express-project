/* jshint expr: true */
'use strict';

var should = require('should');
var nock = require('nock');

var requireHelper = require('../require_helper');
var flickrAPI = requireHelper('externalAPI/flickrAPI');


describe('flickerAPI.js', function () {

  describe('getFlickrPhotosByParams(tags, callback)', function () {

    it('should return photos', function () {

      // mock the flickr public feed api endpoint
      var jsonpData = 'jsonFlickrFeed({"items": [' +
        '{ "title": "Boating",' +
          '"media": {"m":"http://farm4.staticflickr.com/3727/12608622365_9e9b8b377d_m.jpg"} },' +
        '{ "title": "Signs",' +
          '"media": {"m":"http://farm8.staticflickr.com/7446/12608714423_efaf73400c_m.jpg"} }' +
        ']})';

      var flickrFeedApi = nock('http://api.flickr.com')
        .get('/services/feeds/photos_public.gne?tags=sydney&format=json')
        .reply(200, jsonpData);

      flickrAPI.getFlickrPhotosByParams('sydney', function (error, photos) {

        if (error !== null) {
          error.should.not.be.ok;
        }

        photos.should.be.an.instanceOf(Object);
        photos.length.should.be.above(0);
        photos[0].should.have.properties('title', 'media');
        photos[0].media.length.should.be.above(0);

      });

    });

    it('should error when api returns 500 http status code', function () {

      // mock the flickr public feed api endpoint and return a 500 error
      var flickrFeedApi = nock('http://api.flickr.com')
        .get('/services/feeds/photos_public.gne?tags=sydney&format=json')
        .reply(500);

      flickrAPI.getFlickrPhotosByParams('sydney', 'all', function (error, photos) {

        should.exist(error);
        error.should.match(/Flickr public feed api error/);
        should.not.exist(photos);

      });

    });

    it('should error with invalid jsonp data', function () {

      // mock the flickr public feed api endpoint with invalid jonsp data that's missing starting parentheses
      var jsonpData = 'jsonFlickrFeed{"items": [' +
        '{ "title": "Boating",' +
          '"media": {"m":"http://farm4.staticflickr.com/3727/12608622365_9e9b8b377d_m.jpg"} },' +
        '{ "title": "Signs",' +
          '"media": {"m":"http://farm8.staticflickr.com/7446/12608714423_efaf73400c_m.jpg"} }' +
        ']}';

      var flickrFeedApi = nock('http://api.flickr.com')
        .get('/services/feeds/photos_public.gne?tags=sydney&format=json')
        .reply(200, jsonpData);

      flickrAPI.getFlickrPhotosByParams('california', 'all', function (error, photos) {

        should.exist(error);
        error.should.match(/Flickr public feed api error/);
        should.not.exist(photos);

      });

    });

  });


});