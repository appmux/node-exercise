(function () {
  'use strict';

  angular
    .module('app.core')
    .config(CoreConfig);

  function CoreConfig($stateProvider) {
    $stateProvider

      .state('app', {
        url: '',
        abstract: true,
        templateUrl: "spa/modules/core/core.content.html",
        controller: 'CoreCtrl',
        controllerAs: 'CoreVm'
      })

      .state('app.core', {
        url: '/',
        redirectTo: 'app.info'
      });

  }
})();
