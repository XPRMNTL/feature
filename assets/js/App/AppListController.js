/* global window */
(function(angular) {
  'use strict';

  var app = angular.module('featureApp');

  app.controller('AppListController', [
    '$controller',
    '$scope',
    'appService',

    function AppListController($controller, $scope, appService) {
      $controller('BaseController', { $scope: $scope });

      appService
        .list()
        .then(function(appList) {
          $scope.appList = appList;
          $scope._loaded(false);
        }, function(err) {
          // FIXME: What to do in case of error
          console.error(err);
          alert('appList fetch err, what now?');
          $scope._loaded(false);
        });

      $scope.nameOrder = function(item) {
        return item.name || item.github_repo;
      };
    }
  ]);

})(window.angular, window.mouthPath || '/');
