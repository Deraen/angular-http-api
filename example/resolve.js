angular.module('testApp2', ['angular-http-api', 'ui.router', 'angular-http-api.router'])
  .config(function($urlRouterProvider, $stateProvider) {
    $stateProvider
      .state('users', {
        url: '/users',
        abstract: true,
        template: '<ui-view/>',
      })
      .state('users.all', {
        url: '',
        resolveApi: {
          users: 'getUsers',
        },
        controller: 'UsersCtrl',
        template: '<ul><li ng-repeat="user in users"><a ui-sref="users.detail({id: user.id})">{{user.name}}</a></li></ul><a ui-sref="users.new">New</a>',
      })
      .state('users.detail', {
        url: '/:id',
        resolveApi: {
          // Use $stateParams.id for urlParams id
          user: ['getUser', {id: '@id'}],
        },
        controller: 'UserCtrl',
        template: '<h1>{{user.name}}, {{user.id}}',
      })
      .state('users.new', {
        url: '^/new_user',
        resolveStatic: {
          user: {data: {id: 42, name: 'New user'}},
        },
        controller: 'UserCtrl',
        template: '<h1>{{user.name}}, {{user.id}}',
      });

    $urlRouterProvider.otherwise('/users');
  })
  .factory('Api', function(ApiFactory) {
    var api = ApiFactory;
    return {
      getUsers: api.get('users.json'),
      getUser: api.get('users-:id.json'),
    };
  })
  .controller('UsersCtrl', function($scope, users) {
    $scope.users = users.data;
  })
  .controller('UserCtrl', function($scope, user) {
    $scope.user = user.data;
  });
