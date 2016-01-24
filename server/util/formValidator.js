'use strict';

var isCorrectCommaDelimited = function (value) {
  // allow letters, commas, numbers and spaces
  var commaDelimitedRegEx = /^[A-Za-z0-9,\s]+$/;
  return commaDelimitedRegEx.test(value);
};

var hasValidFlickrAPIParams = function (tags) {
  return isCorrectCommaDelimited(tags) || isEmptyStringValid(tags);
};

var isEmptyStringValid = function (value) {
  //allows any html-sanitized empty string
  return (!value || value.length === 0)
};

module.exports = {
  hasValidFlickrAPIParams: hasValidFlickrAPIParams,
  isCorrectCommaDelimited: isCorrectCommaDelimited,
  isEmptyStringValid: isEmptyStringValid
};
