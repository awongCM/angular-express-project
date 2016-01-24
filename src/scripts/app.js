'use strict';

var angular = require('angular');

var MainCtrl = require('./controllers/MainCtrl');

var MainService = require('./services/MainService');

var app = angular.module('myApp', []);

app.controller('MainCtrl', ['$scope','MainService', MainCtrl]);
app.service('MainService', ['$http', MainService]);