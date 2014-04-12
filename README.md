# Angular-HTTP-Api

[![Build Status](https://travis-ci.org/Deraen/angular-http-api.svg?branch=master)](https://travis-ci.org/Deraen/angular-http-api)

Provides a way to make http requests where endpoint urls are defined once per project.

## Why not $resouce

- All APIs aren't RESTful

## Example

```JavaScript
angular.module('testApp', ['angular-http-api'])
  .factory('Api', function(ApiFactory) {
    var api = ApiFactory;
    return {
      getUsers: api.get('/users'),
      getUser: api.get('/users/:id'),
      newUser: api.post('/users'),
    };
  });
```

## Integration with UI-Router

With [UI-Router](https://github.com/angular-ui/ui-router.git) one can use `resolve`-property
to define dependencies which will be injected into controller. If dependancy is a promise (eg. http-request)
it will be resolved before state transition is completed.

UI-Router also provides a way to preprocess state properties. `angular-http-api.router`-module
provides decorator which implements `resolveApi`-decorator. Examples dir contains a [complete example](./example/resolve.js).

```JavaScript
.state('users.detail', {
  url: '/:id',
  resolveApi: {
    user: ['getUser', {id: '@id'}],
  },
  controller: 'UserCtrl',
  template: '<h1>{{user.name}}, {{user.id}}',
})
```

## TODO

- More documentation
- Test UI-Router decorator automatically
- resolveApi decorator presumes that user has `Api` named factory which defines the endpoints
