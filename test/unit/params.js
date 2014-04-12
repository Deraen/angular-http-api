describe('params', function() {
  beforeEach(module('angular-http-api'));

  var ApiFactory;
  beforeEach(inject(function(_ApiFactory_) {
    ApiFactory = _ApiFactory_;
  }));

  var tests = [
    ['/users/:id', {id: 5}, '/users/5'],
    ['/users/:id.json', {id: 5}, '/users/5.json'],
    ['/users/:id/:id', {id: 5}, '/users/5/5'],
    ['/users/:id/:id2', {id: 5, id2: 'foo'}, '/users/5/foo'],
    // ['/users/:id?', {}, '/users'],
    ['/users/:foo?/:bar', {bar: 'test'}, '/users/test'],
  ];

  tests.forEach(function(e) {
    it(e[0] + ' + ' + JSON.stringify(e[1]) + ' => ' + e[2], function() {
      expect(ApiFactory.replaceParams(e[0], e[1])).to.equal(e[2]);
    });
  });
});
