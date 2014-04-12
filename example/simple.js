function mockServer($httpBackend) {
  $httpBackend.when('GET', '/users').respond([{name: 'Esko', id: 1}, {id: 2}]);
  $httpBackend.when('GET', '/users?search=foobar&start=10').respond([{id: 1}, {id: 2}]);
  $httpBackend.when('GET', '/users/1').respond({name: 'Esko', id: 1});
  $httpBackend.when('POST', '/users', {name: 'test'}).respond({id: 5, name: 'test'});
}

angular.module('testApp', ['angular-http-api'])
  .factory('Api', function(ApiFactory) {
    var api = ApiFactory;
    return {
      getUsers: api.get('/users'),
      getUser: api.get('/users/:id'),
      newUser: api.post('/users'),
    };
  });
