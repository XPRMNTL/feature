/* global window */
(function(angular) {
  'use strict';

  console.info('EditAppController loaded');

  var app = angular.module('featureApp');

  app.controller('EditAppController', [
    '$controller',
    '$scope',
    '$routeParams',
    'appService',

    function EditAppController($controller, $scope, $routeParams, appService) {
      $controller('BaseController', { $scope: $scope });
      $scope.choices = {};

      function setChoices(name, items) {
        $scope.choices[name] = items.map(function(item) {
          if (typeof item === 'string') item = {
            name: item,
            disabled: false
          };

          return item;
        });
      }

      setChoices('types', [
        'boolean',
        'reference',
        'range',
        { name: 'variants', disabled: true },
        { name: 'groups', disabled: true }
      ]);
      setChoices('boolean', [
        { name: 'Enable', val: true },
        { name: 'Disable', val: false }
      ]);
      setChoices('reference', [ 'local', 'beta', 'prod' ]);


      (function(items) {
        $scope.types = items.map(function(item) {

          if (typeof item === 'string') item = {
            name: item,
            disabled: false
          };

          return item;
        });
      })([
        'boolean',
        'reference',
        { name: 'range', disabled: true },
        { name: 'variants', disabled: true },
        { name: 'groups', disabled: true }
      ]);

      var repo = $routeParams.repo;
      var master = {};

      appService
        .fromRepo(repo)
        .then(function(app) {
          update(app);
          $scope._loaded(false);
        }, function(err) {
          // FIXME: what to do in case of error?
          console.error(err);
          alert('fetch error');
        });

      $scope.cancel = function() {
        $scope.app = angular.copy(master);
        $scope.editMode = false;
      };

      $scope.toggleEdit = function() {
        $scope.editMode = ! $scope.editMode;
      };

      $scope.isUnchanged = function(appData) {
        return angular.equals(appData, master);
      };

      $scope.save = function() {
        appService
          .save($scope.app)
          .then(function(data) {
            update(data);
            $scope.editMode = false;
          }, function(err) {
            $scope.failText = 'Create failed, sry: {0} ({1})'.format(err.statusText, err.status);

            //FIXME: Error state for this
            alert('Something went wrong...');
            console.error(err);
          });
      };

      $scope.$watch('app.groups', function(val, prev) {
        if (! prev) return;

        appService
          .saveGroups($scope.app._id, val)
          .then(function(groups) {
            // FIXME: Do something here please
            console.info(groups);
            alert('group saved');
          }, function(err) {
            // FIXME: Error state here
            alert(err);
            console.error(err);
          });
      }, true);

      // $scope.$on('saveGroup', function(evt, group) {
      //   if (! angular.isArray(group.list)) return;

      //   console.log(group);
      //   console.log($scope.app.groups);
      //   console.info('suphomie');
      // });

      function update(data) {

        if (! data.groups) data.groups = {};

        var test = {
          name : data.name,
          dev_key : data.dev_key,
          references : [ 'local', 'beta', 'prod', ],
          groups : {
            'Web Devs': [ 'dncrews', 'jdcrowthe', 'jamesblack' ],
            'phase 1': {
              min: 20,
              max: 30,
            },
            'phase 2': {
              min: 20,
              max: 50,
            },
            'phase 3': {
              min: 20,
              max: 60,
            },
          },
          experiments : [
            {
              name : 'sampleExp',
              description : 'This is a pretend experiment, but here I\'ve defined what the description would\'ve been.',
              // links: [ 'https://google.com', { 'Description': 'What\'s the point of this link?', 'url': 'https://familysearch.org'}, ],
              value : true,
              references : null,
              date_modified: '2014-09-20T20:16:17.483Z',
            },
            {
              name : 'testLinkExp',
              description : 'This description has a link. Likey? <a target="reference" href="https://google.com">Here is a link.</a>. I wish there was an easier way to do this...',
              value : false,
              references : null,
              date_modified: '2014-08-19T20:16:17.483Z',
            },
            {
              name : 'headerFooterExp',
              description : 'This boolean has differing values',
              value : false,
              references : {
                local : true,
                prod : [ { min: 0, max: 25, percent: 26 }, { min: 26, max: 50, percent: 25 }, 'Web Devs' ],
              },
              date_modified: '2014-08-18T20:16:17.483Z',
            },
            // {
            //   name : 'rangedExp',
            //   description : 'This one has a range too',
            //   value : null,
            //   values : {
            //     local : true,
            //     beta : true,
            //     prod : '0-20%',
            //   },
            //   date_modified: '2014-08-17T20:16:17.483Z',
            // },
            // {
            //   name : 'var1',
            //   description : 'This is a variant',
            //   value : null,
            //   values : {
            //     blue : '0-20%',
            //     red : '21-50%',
            //     green : '51-100%',
            //   },
            //   variants : [ 'blue', 'red', 'green' ],
            //   date_modified: '2014-08-16T20:16:17.483Z',
            // },
            // {
            //   name : 'var2',
            //   description : 'This has no 51-100%',
            //   value : null,
            //   values : {
            //     something : '0-20%',
            //     somethingElse : '21-50%',
            //   },
            //   variants : [ 'something', 'somethingElse' ],
            //   date_modified: '2014-08-15T20:16:17.483Z',
            // },
          ],
        };

        // $scope.appTest = test;
        console.log(data.experiments, test.experiments);

        master = angular.copy(data);
        $scope.app = data;
      }
    }
  ]);

})(window.angular, window.mouthPath || '/');
