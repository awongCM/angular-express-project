'use strict';

var MainCtrl = function ($scope, MainService) {

  //My Models
  $scope.searchFormData = {
    tags: ''
  };
  $scope.photoGalleryData = {};

  //$scope functions
  $scope.loadAllPhotos = function(){
    MainService.get().then(function (data) {
      $scope.photoGalleryData = data;
      console.log(data);
    });

  };

  $scope.searchPhotos = function(){
    MainService.query($scope.searchFormData).then(function (data) {
      $scope.photoGalleryData = data;
      console.log(data);
    });
  };

};

module.exports = MainCtrl;