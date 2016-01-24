/* jshint expr: true */
'use strict';

var should = require('should');

var requireHelper = require('../require_helper');
var formValidator = requireHelper('util/formValidator');

describe('formValidator.js', function () {

  describe('isCorrectCommaDelimited(value)', function () {

    it('should return true for valid list of search terms', function () {
      var tags = 'sydney, sunset, red';
      formValidator.isCorrectCommaDelimited(tags).should.be.true;

    });

    it('should return true for valid single search term', function () {
      var tags = 'monkeys';
      formValidator.isCorrectCommaDelimited(tags).should.be.true;

    });

    it('should return false for search term containing numbers', function () {
      var tags = 'monkeys123';
      formValidator.isCorrectCommaDelimited(tags).should.be.false;

    });

    it('should return false for search term containing special characters', function () {
      var tags = 'monkeys%$';
      formValidator.isCorrectCommaDelimited(tags).should.be.false;

    });

  });

  describe('isEmptyStringValid', function() {
    it('should return true for an zero-based length string', function () {
      var value = "";
      formValidator.isEmptyStringValid(value).should.be.true;

    });

    it('should return true for null value ', function () {
      var value = null;
      formValidator.isEmptyStringValid(value).should.be.true;

    });

    it('should return true for undefined value ', function () {
      var value = undefined;
      formValidator.isEmptyStringValid(value).should.be.true;

    });

    it('should return false for a string length greater than one', function () {
      var value = '123456';
      formValidator.isEmptyStringValid(value).should.be.false;

    });

  });

  describe('hasValidFlickrAPIParams(tags, tagmode)', function () {

    it('should return true for valid params', function () {
      var tags = 'dogs, poodles';
      var tagmode = 'all';
      formValidator.hasValidFlickrAPIParams(tags, tagmode).should.be.true;

    });


    it('should return false for invalid tags', function () {
      var tags = 'dogs, poodles123';
      var tagmode = 'all';
      formValidator.hasValidFlickrAPIParams(tags, tagmode).should.be.false;

    });


    it('should return false for invalid tagmode', function () {
      var tags = 'dogs, poodles';
      var tagmode = 'all123';
      formValidator.hasValidFlickrAPIParams(tags, tagmode).should.be.false;

    });

  });


});