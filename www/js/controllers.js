angular.module('starter.controllers', ['ionic-material','ionic.cloud','ngCordova'])

.controller('AppCtrl', function($scope, $ionicPlatform, $ionicActionSheet, $ionicLoading, $ionicModal, $timeout, ionicMaterialInk, $ionicAuth, $state, $ionicUser, SignUpService, LoginService, $cordovaCamera) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    if (LoginService.user.email == "") {
        $scope.loginClass = true;
    } else {
        $scope.loginClass = false;
    }
$ionicPlatform.ready(function () {

    $scope.showActionsheet = function() {

        $ionicActionSheet.show({
            titleText: 'ActionSheet Example',
            buttons: [
                { text: '<i class="icon ion-camera"></i> Take photo' },
                { text: '<i class="icon ion-images"></i> Choose from library' },
            ],

            cancelText: 'Cancel',
            cancel: function() {
                console.log('CANCELLED');
            },
            buttonClicked: function(index) {
                if (index == 0){
                    $scope.takeProfile();
                }else if (index == 1){
                    $scope.getGalleryPhoto();
                }
            },
            destructiveButtonClicked: function() {
                console.log('DESTRUCT');
                return true;
            }
        });
    };

    $scope.getGalleryPhoto =function () {
        var galleryOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true,
            correctOrientation: true //Corrects Android orientation quirks
        };

        $cordovaCamera.getGalleryPhoto(galleryOptions).then(function(imageData) {
            console.log(imageData);
            $scope.profilePicture = "data:image/jpeg;base64," + imageData;
            $scope.signupForm.photo = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // error
        });

    }

    $scope.takeProfile = function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true,
            correctOrientation: true //Corrects Android orientation quirks
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            console.log(imageData);
            $scope.profilePicture = "data:image/jpeg;base64," + imageData;
            $scope.signupForm.photo = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // error
        });

    };
});
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
            $ionicLoading.show({
                templateUrl: 'templates/loading.html',
                hideOnStateChange: true
            }).then(function(){
                console.log("The loading indicator is now displayed");
            });
            $ionicAuth.login('basic', details, {'remember': false}).then(function () {

                LoginService.email = $ionicUser.details.email;
                LoginService.password = $ionicUser.details.password;

                $scope.logErrEmail = "";

                LoginService.getUserByEmail(LoginService.email).then(function(response) {
                    LoginService.user = response.data;
                    $scope.user = LoginService.user;
                    if (LoginService.user.user_type == "user") {
                        $timeout(function() {
                            $state.go("app.user");
                            $scope.modal.hide();
                        }, 200);
                    } else if (LoginService.user.user_type == "driver") {
                        $timeout(function() {
                            $state.go("app.driver");
                            $scope.modal.hide();
                        }, 1000);

                    }
                }, function(error) {
                    console.log("Error: " + error);

                    LoginService.user = {};
                });


            }, function (err) {
                console.log("error :" + err);
                $scope.validation = "Please make sure that you are registered.";
                $scope.logErrEmail = "";
                $ionicLoading.hide();
                LoginService.password = "";
            });
        }

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {

        }, 1000);
    };

    $scope.signupForm = {
        user_name: "",
        email_address: "",
        password_hash: "",
        photo: "",
        user_type: ""
    };

    $scope.registered = {
        title: "",
        msg: ""
    };

    $scope.doSignUp = function() {
        if ($scope.signupForm.user_name == "" || $scope.signupForm.email_address == "" || $scope.signupForm.password_hash == ""
            || $scope.signupForm.user_type == "" || $scope.signupForm.photo == null) {
            $scope.error = 'Please fill in all the fields.';
            console.log($scope.signupForm);
        } else {
            $ionicLoading.show({
                templateUrl: 'templates/loading.html',
                hideOnStateChange: true
            }).then(function(){
                console.log("The loading indicator is now displayed");
            });
            $ionicAuth.signup({'email': $scope.signupForm.email_address, 'password': $scope.signupForm.password_hash}).then(function() {
                SignUpService.user = $scope.signupForm;
                console.log(SignUpService.user);
                SignUpService.addUser();
                $scope.login();
                $scope.closeSignUp();
                $ionicLoading.hide();
                $scope.registered = {
                    title: "Thank you for signing up!",
                    msg: "Please log in with your newly created account details."
                }
                // `$ionicUser` is now registered
                // then go to profile with state.go & close modal
            }, function(err) {
                console.log(err);
                $ionicLoading.hide();
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

.controller('ServiceCtrl', function($scope, $state, ionicMaterialMotion, ionicMaterialInk, $ionicPlatform, UberService) {
    $ionicPlatform.ready(function () {
        ionicMaterialInk.displayEffect();
        $scope.$on("$ionicView.enter", function () {

            UberService.getCurrentService(UberService.serviceId).then(function (response) {
                $scope.item = response.data;
                $scope.jobDone = function () {
                    UberService.jobDone(UberService.serviceId).then(function () {
                        $state.go('app.user');
                    });
                };
            });


        });


        // $ionicPlatform.ready(function () {
        //   setTimeout(function() {
        //     ionicMaterialMotion.blinds();
        //   }, 500);
        // });
    });

})

    .controller('historyCtrl', function ($scope, $state, $ionicPlatform, $ionicUser, UberService, LoginService, ionicMaterialInk) {
        $ionicPlatform.ready(function () {
            ionicMaterialInk.displayEffect();
            $scope.$on("$ionicView.enter", function () {
                if (LoginService.user.email == "") {
                    $state.go('app.login');
                }
                if (LoginService.user.user_type = "user") {
                    UberService.getUserHistory(LoginService.user.id).then(function (response) {
                        $scope.historyItems = response.data;
                        $scope.seeHistory = function (item) {
                            $state.go("app.historydetail", {"historyId": item});
                        };
                    });
                } else if (LoginService.user.user_type = "driver") {
                    UberService.getVendorHistory(LoginService.user.id).then(function (response) {
                        $scope.historyItems = response.data;
                    });
                    $scope.seeHistory = function (item) {
                        $state.go("app.historydetail", {"historyId": item});
                    };
                }
            })
        });
    })

    .controller('HistoryDetailCtrl', function ($scope, UberService, $stateParams, LoginService, ionicMaterialInk) {
        $ionicPlatform.ready(function () {
            ionicMaterialInk.displayEffect();

            if (LoginService.user.email == "") {
                $state.go('app.login');
            }
            $scope.$on("$ionicView.enter", function () {
                $scope.historyId = $stateParams.historyId;
                if (LoginService.user.user_type = "user") {
                    UberService.getHistoryDetailUser($scope.historyId).then(function (response) {
                        $scope.itemDetail = response.data;
                        console.log($scope.itemDetail);


                        $scope.posU = new google.maps.LatLng(parseFloat($scope.itemDetail.latitude), parseFloat($scope.itemDetail.longitude));
                        ;

                        $scope.mapUOptions = {
                            center: $scope.posU,
                            zoom: 12,
                            scrollwheel: false,
                            mapTypeControl: false,
                            streetViewControl: false,
                            styles: [{
                                "featureType": "all",
                                "elementType": "all",
                                "stylers": [{"visibility": "on"}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels",
                                "stylers": [{"visibility": "off"}, {"saturation": "-100"}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels.text.fill",
                                "stylers": [{"saturation": 36}, {"color": "#000000"}, {"lightness": 40}, {"visibility": "on"}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels.text.stroke",
                                "stylers": [{"visibility": "on"}, {"color": "#000000"}, {"lightness": 16}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels.icon",
                                "stylers": [{"visibility": "on"}]
                            }, {
                                "featureType": "administrative",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#000000"}, {"lightness": 20}]
                            }, {
                                "featureType": "administrative",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#000000"}, {"lightness": 17}, {"weight": 1.2}]
                            }, {
                                "featureType": "landscape",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 20}]
                            }, {
                                "featureType": "landscape",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "landscape",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "landscape.natural",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "poi",
                                "elementType": "geometry",
                                "stylers": [{"lightness": 21}]
                            }, {
                                "featureType": "poi",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "poi",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "road",
                                "elementType": "geometry",
                                "stylers": [{"visibility": "on"}, {"color": "#7f8d89"}]
                            }, {
                                "featureType": "road",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.highway",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}, {"lightness": 17}]
                            }, {
                                "featureType": "road.highway",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#7f8d89"}, {"lightness": 29}, {"weight": 0.2}]
                            }, {
                                "featureType": "road.arterial",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 18}]
                            }, {
                                "featureType": "road.arterial",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.arterial",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.local",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 16}]
                            }, {
                                "featureType": "road.local",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.local",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "transit",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 19}]
                            }, {
                                "featureType": "water",
                                "elementType": "all",
                                "stylers": [{"color": "#2b3638"}, {"visibility": "on"}]
                            }, {
                                "featureType": "water",
                                "elementType": "geometry",
                                "stylers": [{"color": "#2b3638"}, {"lightness": 17}]
                            }, {
                                "featureType": "water",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#24282b"}]
                            }, {
                                "featureType": "water",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#24282b"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.text",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.text.fill",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.text.stroke",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.icon",
                                "stylers": [{"visibility": "off"}]
                            }]
                        };

                        $scope.mapU = new google.maps.Map(document.getElementById("history-map"), $scope.mapUOptions);

                        var icon = {
                            url: "img/gps.png", // url
                            scaledSize: new google.maps.Size(25, 25), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                        };

                        $scope.marker = new google.maps.Marker({
                            map: $scope.mapU,
                            position: $scope.posU,
                            icon: icon

                        });
                    }, function (error) {
                        console.log("Error: " + error);
                    });
                }
            });

            $scope.$on("$ionicView.enter", function () {
                if (LoginService.user.user_type = "driver") {
                    UberService.getHistoryDetailVendor($scope.historyId).then(function (response) {
                        $scope.itemDetail = response.data;
                        console.log($scope.itemDetail);
                    }, function (error) {
                        console.log("Error: " + error);
                    });
                }

            });
        });
    })

    .controller('QuoteCtrl', function ($scope, $state, UberService, $interval, $stateParams, LoginService, ionicMaterialInk) {
        $ionicPlatform.ready(function () {
            ionicMaterialInk.displayEffect();

            if (LoginService.user.email == "") {
                $state.go('app.login');
            }
            $scope.$on("$ionicView.enter", function () {
                if (LoginService.user.user_type == "user") {
                    $scope.userView = true;
                    $scope.addQuote = function (quote) {
                        delete quote.user_name;
                        delete quote.user_type;
                        $scope.serviceId = quote.id;

                        UberService.acceptQuote(quote.id).then(function (response) {
                            UberService.serviceId = response.data;
                            $state.go('app.service');
                        });
                    };

                    $scope.dismissQuote = function (quote) {
                        UberService.deleteQuote(quote.id).then(function () {
                            console.log('Quote deleted');
                        });
                    };
                    $interval(function () {
                        UberService.getQuotesUser(LoginService.user.id).then(function (response) {
                            $scope.serviceItems = response.data;
                        }, function (error) {
                            console.log("Error: " + error);
                        });
                    }, 1000);

                }
                ;

                if (LoginService.user.user_type !== "user") {
                    $scope.userView = false;
                    $interval(function () {
                        UberService.getQuotesVendor(LoginService.user.id).then(function (response) {
                            $scope.serviceItems = response.data;
                            $scope.dismissQuote = function (quote) {
                                UberService.deleteQuote(quote.id).then(function () {
                                    console.log('Quote deleted');
                                });
                            };
                        }, function (error) {
                            console.log("Error: " + error);
                        });
                    }, 1000);

                }

            });
        });
    })

    .controller('RequestDetailCtrl', function ($scope, UberService, $state, $stateParams, $ionicLoading, LoginService, ionicMaterialInk) {
        $ionicPlatform.ready(function () {
            ionicMaterialInk.displayEffect();

            // if (LoginService.user.email == "") {
            //     $state.go('app.login');
            // }
            $scope.$on("$ionicView.enter", function () {
                $ionicLoading.show({
                    templateUrl: 'templates/loading.html',
                    hideOnStateChange: true
                }).then(function () {
                });
                $scope.itemId = $stateParams.itemId;
                UberService.getRequest($scope.itemId).then(function (response) {
                    $scope.item = response.data;

                    if ($scope.item.service_type == "repair") {
                        $scope.repair = true;
                    } else {
                        $scope.repair = false;
                    }

                    //GET DISTANCE FOR PRICES
                    $scope.q = UberService.driverLat;
                    $scope.w = UberService.driverLng;
                    $scope.e = $scope.item.latitude;
                    $scope.r = $scope.item.longitude;
                    var origin = new google.maps.LatLng($scope.q, $scope.w); // using google.maps.LatLng class
                    var destination = $scope.e + ', ' + $scope.r; // using string

                    var directionsService = new google.maps.DirectionsService();
                    var request = {
                        origin: origin, // LatLng|string
                        destination: destination, // LatLng|string
                        travelMode: google.maps.DirectionsTravelMode.DRIVING
                    };

                    directionsService.route(request, function (response, status) {

                        if (status === 'OK') {
                            var point = response.routes[0].legs[0];
                            var dist = point.distance.value;
                            var distKM = dist / 1000;
                            var distance = distKM.toFixed(2);
                            $scope.distance = parseFloat(distance);
                            $scope.costSum = parseFloat($scope.distance) * parseFloat(UberService.rate);
                            var cost = $scope.costSum.toFixed(2);
                            $scope.cost = parseFloat(cost);
                            $scope.part = {
                                cost: 0
                            };

                            $ionicLoading.hide();


                        }
                    });


                    $scope.addQuote = function () {
                        UberService.quote.service_type = $scope.item.service_type;
                        UberService.quote.longitude = $scope.item.longitude;
                        UberService.quote.latitude = $scope.item.latitude;
                        UberService.quote.user_id = $scope.item.user_id;
                        UberService.quote.photo = $scope.item.photo;
                        UberService.quote.vendor_id = LoginService.user.id;
                        UberService.quote.distance = $scope.distance;
                        if ($scope.item.service_type == "repair") {
                            var totalCost = parseFloat($scope.cost) + parseFloat($scope.part.cost);
                            $scope.tCost = parseFloat(totalCost);
                            UberService.quote.cost = $scope.tCost;
                            console.log(UberService.quote.cost);
                            UberService.addQuote().then(function () {
                                $state.go('app.quotes');
                            }, function (error) {
                                console.log("Error: " + error);
                            });
                        } else {
                            UberService.quote.cost = $scope.cost;
                            UberService.addQuote().then(function () {
                                $state.go('app.quotes');
                            }, function (error) {
                                console.log("Error: " + error);
                            });
                        }

                    };

                }, function (error) {
                    console.log("Error: " + error);
                });

            });
        });
    })

    .controller('AddRequestCtrl', function($scope, $ionicPlatform, ionicMaterialInk, $ionicLoading, $ionicModal, $compile, $cordovaCamera, $ionicPopup, $stateParams, UberService, LoginService, $state, $cordovaGeolocation) {
        $ionicPlatform.ready(function () {
            ionicMaterialInk.displayEffect();

            $scope.$on("$ionicView.enter", function () {
                $ionicLoading.show({
                    templateUrl: 'templates/loading.html',
                    hideOnStateChange: true
                }).then(function () {
                });
            });
            $scope.$on("$ionicView.enter", function () {

                if (LoginService.user.user_type == "driver") {
                    //DRIVERS MAIN MAP
                    $scope.userType = true;

                    $ionicPlatform.ready(function () {

                        var watchDOptions = {
                            timeout: 1000,
                            enableHighAccuracy: false,
                            maximumAge: 100
                        };

                        var watchD = $cordovaGeolocation.watchPosition(watchDOptions);
                        watchD.then(
                            null,
                            function (err) {
                                // error
                            },
                            function (position) {
                                $scope.currentDlat = position.coords.latitude;
                                $scope.currentDlong = position.coords.longitude;
                                $scope.posDriver = new google.maps.LatLng($scope.currentDlat, $scope.currentDlong);
                                $scope.mapDriver.panTo($scope.posDriver);
                                $scope.marker.setPosition($scope.posDriver);

                            });

                        $scope.mapDriverOptions = {
                            center: $scope.posDriver,
                            zoom: 12,
                            scrollwheel: false,
                            mapTypeControl: false,
                            streetViewControl: false,
                            styles: [{
                                "featureType": "all",
                                "elementType": "all",
                                "stylers": [{"visibility": "on"}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels",
                                "stylers": [{"visibility": "off"}, {"saturation": "-100"}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels.text.fill",
                                "stylers": [{"saturation": 36}, {"color": "#000000"}, {"lightness": 40}, {"visibility": "on"}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels.text.stroke",
                                "stylers": [{"visibility": "on"}, {"color": "#000000"}, {"lightness": 16}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels.icon",
                                "stylers": [{"visibility": "on"}]
                            }, {
                                "featureType": "administrative",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#000000"}, {"lightness": 20}]
                            }, {
                                "featureType": "administrative",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#000000"}, {"lightness": 17}, {"weight": 1.2}]
                            }, {
                                "featureType": "landscape",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 20}]
                            }, {
                                "featureType": "landscape",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "landscape",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "landscape.natural",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "poi",
                                "elementType": "geometry",
                                "stylers": [{"lightness": 21}]
                            }, {
                                "featureType": "poi",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "poi",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "road",
                                "elementType": "geometry",
                                "stylers": [{"visibility": "on"}, {"color": "#7f8d89"}]
                            }, {
                                "featureType": "road",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.highway",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}, {"lightness": 17}]
                            }, {
                                "featureType": "road.highway",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#7f8d89"}, {"lightness": 29}, {"weight": 0.2}]
                            }, {
                                "featureType": "road.arterial",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 18}]
                            }, {
                                "featureType": "road.arterial",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.arterial",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.local",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 16}]
                            }, {
                                "featureType": "road.local",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.local",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "transit",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 19}]
                            }, {
                                "featureType": "water",
                                "elementType": "all",
                                "stylers": [{"color": "#2b3638"}, {"visibility": "on"}]
                            }, {
                                "featureType": "water",
                                "elementType": "geometry",
                                "stylers": [{"color": "#2b3638"}, {"lightness": 17}]
                            }, {
                                "featureType": "water",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#24282b"}]
                            }, {
                                "featureType": "water",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#24282b"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.text",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.text.fill",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.text.stroke",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.icon",
                                "stylers": [{"visibility": "off"}]
                            }]
                        };

                        $scope.mapDriver = new google.maps.Map(document.getElementById("main-map-driver"), $scope.mapDriverOptions);

                        var icon = {
                            url: "img/gps.png", // url
                            scaledSize: new google.maps.Size(25, 25), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                        };

                        $scope.marker = new google.maps.Marker({
                            map: $scope.mapDriver,
                            position: $scope.posDriver,
                            icon: icon

                        });


                        UberService.getServiceRequest().then(function (response) {
                            $scope.requestsFromUsers = response.data;

                            $scope.seeRequest = function (item) {
                                UberService.driverLat = $scope.currentDlat;
                                UberService.driverLng = $scope.currentDlong;
                                console.log(UberService.driverLat);
                                $state.go('app.requestdetail', {"itemId": item});
                            };

                            var userPos = $scope.requestsFromUsers;

                            var infowindow = new google.maps.InfoWindow();

                            for (var i = 0; i < userPos.length; i++) {
                                var latitude = userPos[i].latitude;
                                var longitude = userPos[i].longitude;
                                var service_type = userPos[i].service_type;
                                var user_name = userPos[i].user_name;
                                var photo = userPos[i].photo;

                                if (service_type == "repair") {
                                    var iconU = {
                                        url: "img/yellow-dot.png", // url
                                        scaledSize: new google.maps.Size(20, 20), // scaled size
                                        origin: new google.maps.Point(0, 0), // origin
                                        anchor: new google.maps.Point(0, 0) // anchor
                                    };
                                } else {
                                    var iconU = {
                                        url: "img/green-dot.png", // url
                                        scaledSize: new google.maps.Size(20, 20), // scaled size
                                        origin: new google.maps.Point(0, 0), // origin
                                        anchor: new google.maps.Point(0, 0) // anchor
                                    };
                                }
                                var marker = new google.maps.Marker({
                                    map: $scope.mapDriver,
                                    position: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
                                    icon: iconU
                                });
                                var content1 = '<button class="button button-balanced button-block" ng-click="seeRequest(' + userPos[i].id + ')">Quote Pickup</button>';


                                var content2 = '<button class="button button-balanced button-block" ng-click="seeRequest(' + userPos[i].id + ')">Quote Repair</button>';
                                var compiledContent1 = $compile(content2)($scope);

                                if (userPos[i].service_type == "pickup") {
                                    google.maps.event.addListener(marker, 'click', (function (marker, content1, i) {
                                        return function () {
                                            var compiled = $compile(content1)($scope);
                                            $scope.$apply();
                                            infowindow.setContent(
                                                compiled[0]
                                            );
                                            infowindow.open($scope.mapDriver, marker);
                                        }
                                    })(marker, content1, i));
                                } else {
                                    google.maps.event.addListener(marker, 'click', (function (marker, content2, i) {
                                        return function () {
                                            infowindow.setContent(
                                                content2
                                            );
                                            infowindow.open($scope.mapDriver, marker);
                                        }
                                    })(marker, compiledContent1[0], i));
                                }

                            }
                            ;
                            $ionicLoading.hide();


                        }, function (err) {

                        });


                    });

                }
                ;

            });

            $scope.$on("$ionicView.enter", function () {

                if (LoginService.user.user_type == "user") {
                    $scope.userType = false;
                    //USERS MAIN MAP
                    $ionicPlatform.ready(function () {

                        $ionicModal.fromTemplateUrl('templates/createrequest.html', {
                            scope: $scope
                        }).then(function (modal) {
                            $scope.requestmodal = modal;
                        });

                        $scope.repair = function () {
                            $scope.requestmodal.show();
                            UberService.serviceRequest.service_type = "repair";
                            UberService.serviceRequest.latitude = $scope.currentlat;
                            UberService.serviceRequest.longitude = $scope.currentlong;
                            UberService.serviceRequest.user_id = LoginService.user.id;
                            console.log(UberService.serviceRequest);
                            console.log(UberService.email);
                        };

                        $scope.closeRepair = function () {
                            $scope.requestmodal.hide();
                        };

                        $scope.takeDamageImage = function () {
                            var options = {
                                quality: 50,
                                destinationType: Camera.DestinationType.DATA_URL,
                                sourceType: Camera.PictureSourceType.CAMERA,
                                allowEdit: true,
                                targetWidth: 100,
                                targetHeight: 100,
                                popoverOptions: CameraPopoverOptions,
                                saveToPhotoAlbum: true,
                                correctOrientation: true //Corrects Android orientation quirks
                            };

                            $cordovaCamera.getPicture(options).then(function (imageData) {
                                console.log(imageData);
                                // var imagedat = document.getElementById("repImg");
                                // imagedat.src = "data:image/jpeg;base64," + imageData;
                                $scope.damageImage = imageData;
                                UberService.serviceRequest.photo = "data:image/jpeg;base64," + imageData;
                                console.log(UberService.serviceRequest);
                            }, function (err) {
                                // error
                            });

                        };

                        $scope.createRepairRequest = function () {
                            UberService.addServiceRequest().then(function () {
                                $scope.go('app.quotes');
                            });
                        };

                        $scope.showPickup = function () {

                            UberService.serviceRequest.service_type = "pickup";
                            UberService.serviceRequest.latitude = $scope.currentlat;
                            UberService.serviceRequest.longitude = $scope.currentlong;
                            UberService.serviceRequest.user_id = LoginService.user.id;
                            console.log(UberService.serviceRequest);
                            console.log(UberService.email);
                            // An elaborate, custom popup
                            var myPopup = $ionicPopup.show({
                                title: 'Send pickup request at this location?',
                                scope: $scope,
                                buttons: [
                                    {text: 'Cancel'},
                                    {
                                        text: 'Send',
                                        type: 'button-positive',
                                        onTap: function (e) {
                                            UberService.addServiceRequest().then(function () {
                                                $state.go('app.quotes');
                                            });
                                        }
                                    }
                                ]
                            });

                            myPopup.then(function (res) {

                            });

                        };


                        var watchOptions = {
                            timeout: 1000,
                            enableHighAccuracy: false,
                            maximumAge: 100
                        };

                        var watch = $cordovaGeolocation.watchPosition(watchOptions);
                        watch.then(
                            null,
                            function (err) {
                                // error
                            },
                            function (position) {
                                $scope.currentlat = position.coords.latitude;
                                $scope.currentlong = position.coords.longitude;
                                $scope.posUser = new google.maps.LatLng($scope.currentlat, $scope.currentlong);
                                $scope.mapUser.panTo($scope.posUser);
                                $ionicLoading.hide();
                                $scope.userMarker.setPosition($scope.posUser);

                            });

                        $scope.requestService = {
                            service_type: "",
                            longitude: "",
                            latitude: "",
                            user_id: LoginService.user.id,
                            photo: ""
                        };

                        $scope.mapOptions = {
                            center: $scope.pos,
                            zoom: 15,
                            scrollwheel: false,
                            mapTypeControl: false,
                            streetViewControl: false,
                            styles: [{
                                "featureType": "all",
                                "elementType": "all",
                                "stylers": [{"visibility": "on"}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels",
                                "stylers": [{"visibility": "off"}, {"saturation": "-100"}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels.text.fill",
                                "stylers": [{"saturation": 36}, {"color": "#000000"}, {"lightness": 40}, {"visibility": "on"}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels.text.stroke",
                                "stylers": [{"visibility": "on"}, {"color": "#000000"}, {"lightness": 16}]
                            }, {
                                "featureType": "all",
                                "elementType": "labels.icon",
                                "stylers": [{"visibility": "on"}]
                            }, {
                                "featureType": "administrative",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#000000"}, {"lightness": 20}]
                            }, {
                                "featureType": "administrative",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#000000"}, {"lightness": 17}, {"weight": 1.2}]
                            }, {
                                "featureType": "landscape",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 20}]
                            }, {
                                "featureType": "landscape",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "landscape",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "landscape.natural",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "poi",
                                "elementType": "geometry",
                                "stylers": [{"lightness": 21}]
                            }, {
                                "featureType": "poi",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "poi",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#4d6059"}]
                            }, {
                                "featureType": "road",
                                "elementType": "geometry",
                                "stylers": [{"visibility": "on"}, {"color": "#7f8d89"}]
                            }, {
                                "featureType": "road",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.highway",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}, {"lightness": 17}]
                            }, {
                                "featureType": "road.highway",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#7f8d89"}, {"lightness": 29}, {"weight": 0.2}]
                            }, {
                                "featureType": "road.arterial",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 18}]
                            }, {
                                "featureType": "road.arterial",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.arterial",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.local",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 16}]
                            }, {
                                "featureType": "road.local",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "road.local",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#7f8d89"}]
                            }, {
                                "featureType": "transit",
                                "elementType": "geometry",
                                "stylers": [{"color": "#000000"}, {"lightness": 19}]
                            }, {
                                "featureType": "water",
                                "elementType": "all",
                                "stylers": [{"color": "#2b3638"}, {"visibility": "on"}]
                            }, {
                                "featureType": "water",
                                "elementType": "geometry",
                                "stylers": [{"color": "#2b3638"}, {"lightness": 17}]
                            }, {
                                "featureType": "water",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#24282b"}]
                            }, {
                                "featureType": "water",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#24282b"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.text",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.text.fill",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.text.stroke",
                                "stylers": [{"visibility": "off"}]
                            }, {
                                "featureType": "water",
                                "elementType": "labels.icon",
                                "stylers": [{"visibility": "off"}]
                            }]
                        };

                        $scope.mapUser = new google.maps.Map(document.getElementById("main-map"), $scope.mapOptions);

                        var icon = {
                            url: "img/gps.png", // url
                            scaledSize: new google.maps.Size(20, 20), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                        };

                        $scope.userMarker = new google.maps.Marker({
                            map: $scope.mapUser,
                            position: $scope.posUser,
                            icon: icon
                        });

                    });
                };

            });
        });

    })

    .controller('UserCtrl', function($scope, $stateParams, UberService, LoginService, $state, ionicMaterialInk) {
        ionicMaterialInk.displayEffect();

        $scope.$on("$ionicView.enter", function() {
            if (LoginService.user.email == "") {
                $state.go('app.login');
            }
            LoginService.getUserByEmail(LoginService.email).then(function (response) {
                LoginService.user = response.data;
                $scope.user = LoginService.user;
                UberService.getUserHistory(LoginService.user.id).then(function (response) {
                    $scope.historyItems = response.data;
                    var items = $scope.historyItems;
                    var total = 0;
                    for (var i = 0; i < items.length; i++) {
                        total += parseFloat(items[i].cost);
                        $scope.totalU = total;
                    }
                    $scope.seeHistory = function (item) {
                        $state.go("app.historydetail", {"historyId": item});
                    };
                });

            }, function (error) {
                console.log("Error: " + error);
                LoginService.user = {};
            });
            console.log(LoginService.user);
        });
    })

    .controller('DriverCtrl', function($scope, $stateParams, LoginService, UberService, ionicMaterialInk) {
        ionicMaterialInk.displayEffect();

        $scope.$on("$ionicView.enter", function() {
            if (LoginService.user.email == "") {
                $state.go('app.login');
            }
            LoginService.getUserByEmail(LoginService.email).then(function (response) {
                LoginService.user = response.data;
                $scope.user = LoginService.user;

                UberService.getVendorHistory(LoginService.user.id).then(function (response) {
                    $scope.historyItems = response.data;
                    var items = $scope.historyItems;
                    var total = 0;
                    for (var i = 0; i < items.length; i++) {
                        total += parseFloat(items[i].cost);
                        $scope.totalU = total;
                    }
                    $scope.seeHistory = function (item) {
                        $state.go("app.historydetail", {"historyId": item});
                    };
                });

            }, function (error) {
                console.log("Error: " + error);
                LoginService.user = {};
            });
            console.log(LoginService.user);
        });
});
