angular.module('starter.services', [])

    .service('SignUpService', function ($http) {

        this.user = {};

        this.email = "";
        this.password = "";

        this.getConfig = function (method, resource, data) {
            if (data == null) {
                data = "";
            }

            var config = {
                method: method,
                url: "http://localhost:8888/cycleuber-api/web/" + resource,
                data: data
            };


            config.headers = {
                "Content-Type": "application/json"
            };
            return config;

        };

        this.addUser = function () {
            return $http(this.getConfig('POST', 'user', this.user));
        };

    })

    .service('LoginService', function ($http) {

        this.user = {};

        this.email = "";
        this.password = "";

        var credentials = this.email + ":" + this.password;

        this.getConfig = function (method, resource, data) {
            if (data == null) {
                data = "";
            }

            var config = {
                method: method,
                url: "http://localhost:8888/cycleuber-api/web/" + resource,
                data: data
            };

            var authHeader = "Basic " + base64.encode(credentials);
            config.headers = {
                "Content-Type": "application/json",
                "Authorization": authHeader
            };
            return config;


        };

        this.getUserByEmail = function (ue) {
            return $http(this.getConfig('GET', 'user/'+ue, ""));
        };

    })

    .service('UberService', function ($http, LoginService) {
        this.serviceRequest = {};
        this.serviceId = 0;
        this.quote = {
            service_type : "",
            longitude : "",
            latitude : "",
            user_id : "",
            photo : "",
            vendor_id : "",
            distance : "",
            cost : ""
        };

        this.rate = 8.5;


        this.driverLat = "";
        this.driverLng = "";

        this.getDistance = function(userLat, userLng, driverLat, driverLng) {
            var origin = new google.maps.LatLng( parseFloat(userLat), parseFloat(userLng) ); // using google.maps.LatLng class
            var destination = driverLat + ', ' + driverLng; // using string

            var directionsService = new google.maps.DirectionsService();
            var request = {
                origin: origin, // LatLng|string
                destination: destination, // LatLng|string
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            directionsService.route( request, function( response, status ) {

                if ( status === 'OK' ) {
                    var point = response.routes[ 0 ].legs[ 0 ];
                    var dist = point.distance.value;
                    var distKM = dist / 1000;
                    $scope.dist = distKM.toFixed(2);
                    console.log($scope.dist);
                    console.log(driverLng);
                }
            } );
        };


        this.email = LoginService.email;
        this.password = LoginService.password;

        var credentials = this.email + ":" + this.password;
        this.getConfig = function (method, resource, data) {
            if (data == null) {
                data = "";
            }

            var config = {
                method: method,
                url: "http://localhost:8888/cycleuber-api/web/" + resource,
                data: data
            };

            var authHeader = "Basic " + base64.encode(credentials);
            config.headers = {
                "Content-Type": "application/json",
                "Authorization": authHeader
            };
            return config;

        };

        this.getUserHistory = function (user_id) {
            return $http(this.getConfig('GET', 'userhistory/'+user_id, ''));
        };

        this.getVendorHistory = function (vendor_id) {
            return $http(this.getConfig('GET', 'vendorhistory/'+vendor_id, ''));
        };

        this.getHistoryDetailUser = function (h_id) {
            return $http(this.getConfig('GET', 'userhistorydetail/'+h_id, ''));
        };

        this.getHistoryDetailVendor = function (h_id) {
            return $http(this.getConfig('GET', 'userhistorydetail/'+h_id, ''));
        };

        this.addServiceRequest = function () {
            return $http(this.getConfig('POST', 'requested', this.serviceRequest));
        };

        this.addQuote = function () {
            return $http(this.getConfig('POST', 'quotes', this.quote));
        };

        this.getServiceRequest = function () {
            return $http(this.getConfig('GET', 'requested', ''));
        };

        this.getRequest = function (itemId) {
            return $http(this.getConfig('GET', 'requested/'+itemId, ''));
        };

        this.getQuotesUser = function (userId) {
            return $http(this.getConfig('GET', 'quotes/'+userId, ''));
        };

        this.getQuotesVendor = function (userId) {
            return $http(this.getConfig('GET', 'vendorquotes/'+userId, ''));
        };

        this.getCurrentService = function (Id) {
            return $http(this.getConfig('GET', 'currentservice/'+Id, ''));
        };

        this.jobDone = function (Id) {
            return $http(this.getConfig('POST', 'jobdone/'+Id, ''));
        };

        this.acceptQuote = function (quoteId) {
            return $http(this.getConfig('POST', 'quoteaccept/'+quoteId, ''));
        };

        this.deleteQuote = function (quoteId) {
            return $http(this.getConfig('DELETE', 'quotes/'+quoteId, ''));
        };

        this.deleteRequest = function (quoteId) {
            return $http(this.getConfig('DELETE', 'requested/'+quoteId, ''));
        };

    })