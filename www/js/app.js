// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-material', 'ionic.cloud'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


  });
})





.config(function($stateProvider, $urlRouterProvider, $ionicCloudProvider) {
    $ionicCloudProvider.init({
        "core": {
            "app_id": "741e2a36"
        }
    });
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    .state('app.home', {
    url: '/',
      views: {
        'menuContent': {
            templateUrl: 'templates/home.html',
            controller: 'AddRequestCtrl'
        }
      }
  })
      .state('app.history', {
        url: '/history',
          views: {
            'menuContent': {
              templateUrl: 'templates/history.html',
              controller: 'historyCtrl'
            }
          }
      })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })


      .state('app.login', {
          url: '/login',
          views: {
              'menuContent': {
                  templateUrl: 'templates/loginpage.html',
                  controller: 'AppCtrl'
              }
          }
      })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
      .state('app.quotes', {
      url: '/quotes',
      views: {
        'menuContent': {
          templateUrl: 'templates/quotes.html',
          controller: 'QuoteCtrl'
        }
      }
    })
      .state('app.user', {
      url: '/user',
      views: {
        'menuContent': {
          templateUrl: 'templates/user.html',
          controller: 'UserCtrl'
        }
      }
    })

      .state('app.driver', {
      url: '/driver',
      views: {
        'menuContent': {
          templateUrl: 'templates/drivers.html',
          controller: 'DriverCtrl'
        }
      }
    })

      .state('app.historydetail', {
      url: '/historydetail',
          params: {
              historyId: 0
          },
      views: {
        'menuContent': {
          templateUrl: 'templates/historydetail.html',
          controller: 'HistoryDetailCtrl'
        }
      }
    })

      .state('app.requestdetail', {
      url: '/requestdetail',
          params: {
              itemId: 0
          },
      views: {
        'menuContent': {
          templateUrl: 'templates/requestdetail.html',
          controller: 'RequestDetailCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
