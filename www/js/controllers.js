angular.module('starter.controllers', ['ionic-material'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, ionicMaterialInk) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $timeout(function(){
    ionicMaterialInk.displayEffect();

  },0);

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, ionicMaterialMotion, $ionicPlatform) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];

  $ionicPlatform.ready(function () {
    setTimeout(function() {
      ionicMaterialMotion.blinds();
    }, 500);
  });


})

    .controller('historyCtrl', function ($scope, ionicMaterialMotion, $ionicPlatform) {
      $scope.historyItems = [
        {id: 1, name: 'John Doe', pickupLocation: 'Johannesburg', distance: 16, cost: 150.00, date: '04-05-2017', serviceType: 'repair'},
        {id: 2, name: 'Jane Doe', pickupLocation: 'Pretoria', distance: 24, cost: 90.00, date: '04-05-2017', serviceType: 'pickup'}
      ];

      $ionicPlatform.ready(function () {
        setTimeout(function() {
          ionicMaterialMotion.blinds();
        }, 200);
      });
    })

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
