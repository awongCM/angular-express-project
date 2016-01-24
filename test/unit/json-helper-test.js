'use strict';

var should = require('should');

var requireHelper = require('../require_helper');
var jsonHelper = requireHelper('util/jsonHelper');

describe('jsonHelper.js', function () {

  describe('parseFeeds(feedData)', function () {

    it('should parse valid feed data', function () {

      var feedData = 'jsonFlickrFeed({"title": "tagged sydney"});';
      var jsonObject = jsonHelper.parseFeeds(feedData);
      jsonObject.should.be.an.instanceOf(Object).and.have.property('title', 'tagged sydney');

    });

    it('should parse feed data with escaped single quotes', function () {

      var feedData = 'jsonFlickrFeed({"title": "tagged sydney\'s port"});';
      var jsonObject = jsonHelper.parseFeeds(feedData);
      jsonObject.should.be.an.instanceOf(Object).and.have.property('title', "tagged sydney's port");

    });

    it('should throw error when parsing invalid feed data', function () {

      // invalid json because of missing double quotes around title value
      var feedData = 'jsonFlickrFeed({"title": tagged sydney});';

      (function () {
        // call the add(item) method without passing in an item
        jsonHelper.parseFeeds(feedData);
      }).should.throw('Error coverting feedData to json: Unexpected token a');

    });

  });

});