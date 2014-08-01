/* global window */
(function(angular) {
  'use strict';

  console.info('AppFilters loaded');

  var app = angular.module('featureApp');

  app.filter('clean', function() {
    return function(str) {
      var e = window.encodeURIComponent;
      return e(e(str));
    };
  });

})(window.angular);
