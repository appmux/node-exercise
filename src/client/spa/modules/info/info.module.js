(function () {
  'use strict';

  angular
    .module('app.info', [
    ])
    .filter('phoneNumber', PhoneNumberFilter);

  function PhoneNumberFilter() {
    return function(number) {
      return (number - 10000000000).toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
  }
})();
