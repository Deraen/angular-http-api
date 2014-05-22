angular.module('angular-http-api', [])
.factory('ApiFactory', function($http) {
  // pattern can have optional parameters:
  // '/foo/bar/:id?/:foo' + {foo: 'abc'} => '/foo/bar/abc'
  // FIXME: is there any use for optional params?

  var paramRegex = new RegExp(':([^\/\?\.]+)([?]?)([\/]?)', 'g');
  function replaceParams(urlRaw, params) {
    var url = urlRaw;
    var match;

    while ((match = paramRegex.exec(urlRaw))) {
      var k = match[1];

      if (params.hasOwnProperty(k)) {
        // Replace param with value in route
        url = url.replace(':' + k + match[2], params[k]);
      } else if (match[2] === '?') {
        // Remove optional param is undefined
        url = url.replace(':' + k + match[2] + match[3], '');
      } else {
        throw 'Missing non-optional url parameter: ' + k + '. ' + JSON.stringify(params);
      }
    }
    return url;
  }

  var api = {
    replaceParams: replaceParams,
  };

  ['get', 'delete', 'put', 'post'].forEach(function(method) {
    api[method] = function(urlRaw) {
      return function(opts) {
        opts = opts || {};
        var url;
        if (opts.urlParams) {
          url = replaceParams(urlRaw, opts.urlParams);
          delete opts.urlParams;
        } else {
          url = urlRaw;
        }

        opts.url = url;
        opts.method = method;
        return $http(opts);
      };
    };
  });

  return api;
});

angular.module('angular-http-api.router', ['angular-http-api', 'ui.router'])
.config(function($stateProvider) {
  function createResolver(v, k) {
    console.log(v, k);
    if (angular.isString(v)) {
      return createResolver([v], k);
    } else if (angular.isArray(v) && v.length >= 1) {
      var endpoint = v[0];

      // FIXME: Use might name Api differently
      return ['$stateParams', 'Api', function($stateParams, Api) {
        // this = state definition
        var opts = {urlParams: {}, params: {}};

        var urlParamMap = v[1];
        angular.forEach(urlParamMap, function(v, k) {
          if (v.length >= 1 && v[0] === '@') {
            opts.urlParams[k] = $stateParams[v.substr(1)];
          } else {
            opts.urlParams[k] = v;
          }
        });

        var queryParamMap = v[2];
        angular.forEach(queryParamMap, function(v, k) {
          if (v.length >= 1 && v[0] === '@') {
            opts.params[k] = $stateParams[v.substr(1)];
          } else {
            opts.params[k] = v;
          }
        });

        return Api[endpoint](opts);
      }];
    }
  }

  // This will add states a parameter called "resolveApi"
  // this works like resolve (check ngRoute.$routeProvider docs)
  // but automatically uses Api function for dependancy
  $stateProvider.decorator('resolveApi', function(state, parent) {
    angular.forEach(state.resolveApi, function(v, k) {
      var resolver = createResolver(v, k);
      if (!resolver) {
        throw 'Invalid resolveApi defintion: ' + k + ' = ' + v;
      }
      state.resolve[k] = resolver;
    });
    return state.resolve;
  });

  // Another decorator for resolves which returns always the same data.
  // This is useful when initializing Controller with empty data (e.g.
  // create item state which uses same controller as regular view edit page)
  $stateProvider.decorator('resolveStatic', function(state, parent) {
    angular.forEach(state.resolveStatic, function(v, k) {
      state.resolve[k] = function() {
        return v;
      };
    });
    return state.resolve;
  });
});
