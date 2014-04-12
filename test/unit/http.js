describe('Example Api', function() {
  var $httpBackend, Api;

  // Module before $injector
  beforeEach(module('testApp'));
  beforeEach(inject(mockServer));
  beforeEach(inject(function(_Api_, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    Api = _Api_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('getUsers', function() {
    $httpBackend.expectGET('/users');
    Api.getUsers();
    $httpBackend.flush();
  });

  it('getUsers with query params', function() {
    $httpBackend.expectGET('/users?search=foobar&start=10');
    Api.getUsers({params: {search: 'foobar', start: 10}});
    $httpBackend.flush();
  });

  it('getUser', function(done) {
    $httpBackend.expectGET('/users/1');
    Api.getUser({urlParams: {id: 1}})
      .success(function(data) {
        expect(data).to.deep.equal({name: 'Esko', id: 1});
        done();
      });
    $httpBackend.flush();
  });

  it('newUser', function(done) {
    $httpBackend.expectPOST('/users', {name: 'test'});
    Api.newUser({data: {name: 'test'}})
      .success(function(data) {
        expect(data).to.deep.equal({name: 'test', id: 5});
        done();
      });
    $httpBackend.flush();
  });
});
