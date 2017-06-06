angular.module('starter.controllers', ['ionic-material','ionic.cloud'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, ionicMaterialInk, $ionicAuth, $state, $ionicUser) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $timeout(function(){
    ionicMaterialInk.displayEffect();

  },0);



  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.signupmodal = modal;
    });

    // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.closeSignUp = function () {
      $scope.signupmodal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.signup = function() {
    $scope.signupmodal.show();
  };
$scope.details = {
    email: "",
    password: ""
}


    var details = $scope.details;
    $scope.doLogin = function() {
        $ionicUser.details.email = $scope.details.email;
        console.log('Doing login', $scope.details);
        $ionicAuth.login('basic', details).then(function () {

            $scope.modal.hide();
            $state.go("app.search"); // go to profile page (Tyron) Make profile pages
        }, function (err) {
            console.log("error :" + err);
            //give error on screen
            //make form fields red
        });
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {

        }, 1000);
    };

    $scope.doSignUp = function() {
        console.log('Doing Signup', $scope.details);
        $ionicAuth.signup(details).then(function() {
            // `$ionicUser` is now registered
            // then go to profile with state.go & close modal
        }, function(err) {
            for (var e of err.details) {
             if (e === 'conflict_email') {
             alert('Email already exists.');
             console.log('Email already exists.');
             } else {
             // handle other errors
             }
             }
        });
        $timeout(function() {

        }, 1000);
    };

  // Perform the login action when the user submits the login form

})

    .controller('LoginCtrl', function($scope, $ionicAuth) {




        $ionicAuth.signup(details).then(function() {
            // `$ionicUser` is now registered
        }, function(err) {
            /*for (var e of err.details) {
                if (e === 'conflict_email') {
                    alert('Email already exists.');
                } else {
                    // handle other errors
                }
            }*/
        });


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

    .controller('historyCtrl', function ($scope, ionicMaterialMotion, $ionicPlatform, $ionicUser) {
      $scope.historyItems = [
        {id: 1, name: 'John Doe', pickupLocation: 'Johannesburg', distance: 16, cost: 150.00, date: '04-05-2017', serviceType: 'repair'},
        {id: 2, name: 'Jane Doe', pickupLocation: 'Pretoria', distance: 24, cost: 90.00, date: '04-05-2017', serviceType: 'pickup'}
      ];

      $scope.useremail = $ionicUser.get('email');

      $ionicPlatform.ready(function () {
        setTimeout(function() {
          ionicMaterialMotion.blinds();
        }, 200);
      });
    })

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
