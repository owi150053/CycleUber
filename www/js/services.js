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
        this.serviceRequest = {
            service_type: "",
            longitude: "",
            latitude: "",
            user_id: "",
            photo: ""
        };



        var email = LoginService.email;
        var password = LoginService.password;

        this.getConfig = function (method, resource, data) {
            if (data == null) {
                data = "";
            }

            var config = {
                method: method,
                url: "http://localhost:8888/cycleuber-api/web/" + resource,
                data: data
            };

            var authHeader = "Basic " + base64.encode(email+":"+password);
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

        this.addLoan = function () {
            return $http(this.getConfig('POST', 'loans', this.loan));
        };

    })