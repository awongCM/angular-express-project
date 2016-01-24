'use strict';

var MainService = function ($http) {
  var urlBase = '/photos';

  //Uses Promises
  var promise;

  return{
    get: function () {
      promise = $http.get(urlBase).then(function(resolved){
        // console.log(resolved);
        return resolved.data;
      },function(rejected){
        // console.log(rejected);
        return rejected;
      });
      return promise;
    },
    query: function (photoQueryData) {
      promise = $http.post(urlBase, photoQueryData).then(function(resolved){
        // console.log(resolved);
        return resolved.data;
      },function(rejected){
        // console.log(rejected);
        return rejected;
      });
      return promise;
    }
  };
};

module.exports = MainService;