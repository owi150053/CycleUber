angular.module('starter.controllers', ['ionic-material','ionic.cloud','ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, ionicMaterialInk, $ionicAuth, $state, $ionicUser, SignUpService, LoginService, $cordovaCamera) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $timeout(function(){
    ionicMaterialInk.displayEffect();

  },0);

    $scope.logout = function () {
        $ionicAuth.logout();
        $state.go('app.login');
    };

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
    };


    var details = $scope.details;
    $scope.doLogin = function() {
        if ($scope.details.email == "" || $scope.details.password == "") {
            $scope.logErrEmail = "Please fill in all fields.";
            $scope.validation = "";
        } else  {
            $ionicAuth.login('basic', details, {'remember': false}).then(function () {

                LoginService.email = $ionicUser.details.email;
                LoginService.password = $ionicUser.details.password;

                $scope.logErrEmail = "";

                LoginService.getUserByEmail(LoginService.email).then(function(response) {
                    LoginService.user = response.data;
                    $scope.user = LoginService.user;
                    if (LoginService.user.user_type == "user") {
                        $state.go("app.user");
                        $scope.modal.hide();
                    } else if (LoginService.user.user_type == "driver") {
                        $state.go("app.driver");
                        $scope.modal.hide();
                    }
                }, function(error) {
                    console.log("Error: " + error);

                    LoginService.user = {};
                });


            }, function (err) {
                console.log("error :" + err);
                $scope.validation = "Please make sure that you are registered.";
                $scope.logErrEmail = "";
                LoginService.password = "";
            });
        }

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {

        }, 1000);
    };

    $scope.takeProfile = function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true,
            correctOrientation: true //Corrects Android orientation quirks
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.profilePicture = imageData;
        }, function(err) {
            // error
        });


    };

    $scope.registered = {
        title: "",
        msg: ""
    };

    $scope.signupForm = {
        user_name: "",
        email_address: "",
        password_hash: "",
        photo: $scope.profilePicture,
        user_type: ""
    };


    $scope.doSignUp = function() {
        if ($scope.signupForm.user_name == "" || $scope.signupForm.email_address == "" || $scope.signupForm.password_hash == ""
            || $scope.signupForm.user_type == "" || $scope.signupForm.photo == null) {
            $scope.error = 'Please fill in all the fields.';
        } else {
            $ionicAuth.signup({'email': $scope.signupForm.email_address, 'password': $scope.signupForm.password_hash}).then(function() {
                SignUpService.user = $scope.signupForm;
                console.log(SignUpService.user);
                SignUpService.addUser();
                $scope.login();
                $scope.closeSignUp();
                $scope.registered = {
                    title: "Thank you for signing up!",
                    msg: "Please log in with your newly created account details."
                }
                // `$ionicUser` is now registered
                // then go to profile with state.go & close modal
            }, function(err) {
                console.log(err);
                $scope.registered = {
                    title: "",
                    msg: ""
                };

                for (var e of err.details) {
                    if (e === 'conflict_email') {
                        $scope.error = 'Email already exists.';
                        console.log('Email already exists.');
                    } else if (e === 'required_email') {
                        // handle other errors
                        //$scope.error = 'Please fill in all the fields.';
                    }
                }
            });
        }

        $timeout(function() {

        }, 1000);
    };

  // Perform the login action when the user submits the login form

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

    .controller('historyCtrl', function ($scope, $state, $ionicPlatform, $ionicUser, UberService, LoginService) {
        if (LoginService.user.email == null) {
            $state.go('app.login');
        }
        if (LoginService.user.user_type = "user") {
            UberService.getUserHistory(LoginService.user.id).then(function (response) {
                $scope.historyItems = response.data;
                $scope.seeHistory = function(item) {
                    $state.go("app.historydetail", {"historyId": item});
                };
            });
        } else if (LoginService.user.user_type = "driver") {
            UberService.getVendorHistory(LoginService.user.id).then(function (response) {
                $scope.historyItems = response.data;
            });
            $scope.seeHistory = function(item) {
                $state.go("app.historydetail", {"historyId": item});
            };
        }

    })

    .controller('HistoryDetailCtrl', function ($scope, UberService, $stateParams, LoginService) {
        if (LoginService.user.email == null) {
            $state.go('app.login');
        }
        $scope.$on("$ionicView.enter", function() {
            $scope.historyId = $stateParams.historyId;
            if (LoginService.user.user_type = "user") {
                UberService.getHistoryDetailUser($scope.historyId).then(function(response) {
                    $scope.itemDetail = response.data;
                    console.log($scope.itemDetail);
                }, function(error) {
                    console.log("Error: " + error);
                });
            } else if (LoginService.user.user_type = "driver") {
                UberService.getHistoryDetailVendor($scope.historyId).then(function(response) {
                    $scope.itemDetail = response.data;
                    console.log($scope.itemDetail);
                }, function(error) {
                    console.log("Error: " + error);
                });
            }

        });

    })

    .controller('UserCtrl', function($scope, $stateParams, LoginService) {
        if (LoginService.user.email == null) {
            $state.go('app.login');
        }
        LoginService.getUserByEmail(LoginService.email).then(function(response) {
            LoginService.user = response.data;
            $scope.user = LoginService.user;

        }, function(error) {
            console.log("Error: " + error);
            LoginService.user = {};
        });
        console.log(LoginService.user);
    })

    .controller('DriverCtrl', function($scope, $stateParams, LoginService) {
        if (LoginService.user.email == null) {
            $state.go('app.login');
        }
    LoginService.getUserByEmail(LoginService.email).then(function(response) {
        LoginService.user = response.data;
        $scope.user = LoginService.user;

    }, function(error) {
        console.log("Error: " + error);
        LoginService.user = {};
    });
    console.log(LoginService.user);
});
