(function () {
  'use strict';

  angular
    .module('app.info')
    .config(InfoConfig);

  function InfoConfig($stateProvider) {

    $stateProvider

      .state('app.info', {
        url: '/info',
        views: {
          'pageContent' : {
            templateUrl: 'spa/modules/info/info.html',
            controller: 'InfoCtrl',
            controllerAs: 'InfoVm'
          }
        }
      });

  }

})();
