(function () {
  'use strict';

  angular
    .module('app.info')
    .controller('InfoCtrl', InfoCtrl)
    .controller('AddContactCtrl', AddContactCtrl);

  function InfoCtrl(
    $http,
    $uibModal
  ) {
    var vm = this,
      url = 'http://127.0.0.1:8090/api' + '/contacts';

    vm.isCollapsed = false;
    vm.selectedContacts = [];

    loadContacts();

    vm.removeContacts = function () {
      var request = {
        url: url,
        method: 'DELETE',
        data: vm.selectedContacts
      };

      $http(request).then(
        function success(response) {
          loadContacts();
          vm.selectedContacts = [];
        }, function failure(response) {
          // console.log('failure', response);
        });

    };

    vm.selectedContact = function (id) {
      var i = vm.selectedContacts.indexOf(id);

      if (i > -1) {
        vm.selectedContacts.splice(i, 1);
      } else {
        vm.selectedContacts.push(id);
      }

      console.log(vm.selectedContacts);
    };

    vm.addContact = function (size) {
      var addContactModal = $uibModal.open({
        animation: true,
        templateUrl: 'addContact.html',
        controller: 'AddContactCtrl',
        size: 'md',
        resolve: {
/*
          items: function () {
            return vm.items;
          }
*/
        }
      });

      addContactModal.result.then(function ok(data) {
        // TODO Add data validation
        console.log('addContact', data);
        addContact(data);
      }, function dismiss() {
      });
    };

    function loadContacts() {
      var request = {
        url: url
      };

      $http(request).then(
        function success(response) {
          vm.columns = response.data.columns;
          vm.contacts = response.data.contacts;
        }, function failure(response) {
        });
    }

    function addContact(data) {
      var request = {
        url: url,
        method: 'POST',
        data: data
      };

      $http(request).then(
        function success(response) {
          loadContacts();
        }, function failure(response) {
        });
    }

  }

  function AddContactCtrl($scope, $uibModalInstance) {
    $scope.data = {};

    $scope.ok = function () {
      $uibModalInstance.close($scope.data);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

})();
