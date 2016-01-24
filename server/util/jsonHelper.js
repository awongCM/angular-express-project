'use strict';

var parseFeeds = function (feedData) {

  try {
    //FeedData is JSONP type
    var startPos = feedData.indexOf('({');
    var endPos = feedData.lastIndexOf('})');
    var jsonString = feedData.substring(startPos + 1, endPos + 1);

    // remove escaped single quotes since they are not valid json
    jsonString = jsonString.replace(/\\'/g, "'");

    //return the actual parsed feed data as JSON
    return JSON.parse(jsonString);
  }
  catch (e) {
    var error = new Error('Error coverting feedData to json: ' + e.message);
    throw error;
  }
};

module.exports = {
  parseFeeds: parseFeeds
};