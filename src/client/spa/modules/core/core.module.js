(function () {
  'use strict';

  angular
    .module('app.core', [
      'ng',
      'ui.router',
      'ui.bootstrap',
      'app.info'
    ])
    .config(CoreConfigure)
    .run(CoreRun);

  angular.module('services', [])
    .service('UserService', function() {

      var vm = this;

      // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
      var setUser = function(user_data) {
        window.localStorage.starter_facebook_user = JSON.stringify(user_data);
      };

      var getUser = function(){
        return JSON.parse(window.localStorage.starter_facebook_user || '{}');
      };

      function isLoggedIn() {
        return false;
      }

      return {
        getUser: getUser,
        setUser: setUser,
        isLoggedIn: isLoggedIn
      };
    });


  function CoreConfigure(
    $urlRouterProvider
  ) {
    $urlRouterProvider.otherwise('/');
  }

  function CoreRun(
    $rootScope,
    $state
  ) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      console.log('core $stateChangeStart', arguments);

      if (typeof toState.redirectTo === 'string') {
        console.log('redirectTo', toState.redirectTo);

        event.preventDefault();
        $state.go(toState.redirectTo);
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {
      console.log('core $stateChangeSuccess', arguments);

      $rootScope.moduleKey = 'module-' + (toState.url.match(/^\/([^\/]*)/)[1] || 'core');
      console.log('moduleKey', $rootScope.moduleKey);
    });
  }

})();
