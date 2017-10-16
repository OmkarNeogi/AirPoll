// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

// Routing
weatherApp.config(function ($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.htm',
            controller: 'homeController'
        })
        .when('/aqi', {
            templateUrl: 'templates/aqi.htm',
            controller: 'aqiController'
        })
});

//Controllers
weatherApp.controller('aqiController', ['$scope', '$resource', 'locationService', function($scope, $resource, locationService) {
    $scope.locationService = locationService;
    // https://api.breezometer.com/baqi/?key=4f8fe524bbc442be8a76df20ec460530&lat=40.7324296&lon=-73.9977264&fields=breezometer_description
    var query_string = 'https://api.breezometer.com/baqi/?';
    $scope.aqiAPI = $resource(query_string, {callback: "JSON_CALLBACK"}, {get: {method: "JSON"}});
    console.log('asd');
    console.log(locationService.lat, locationService.lon);
    $scope.aqiResult = $scope.aqiAPI.get({
        lat: locationService.lat,
        lon: locationService.lon,
        fields: 'breezometer_description',
        key: '4f8fe524bbc442be8a76df20ec460530',
    });

    console.log($scope.aqiResult);
}]);

weatherApp.controller('homeController', ['$scope', function($scope, locationService) {
    console.log('inside homecontroller');
}]);


// Attributed to: https://stackoverflow.com/questions/24636711/google-places-autocomplete-with-angular-js
weatherApp.controller('mapController', ['$scope', 'locationService', function ($scope, locationService) {
    $scope.userlocation = {'from': '', 'fromLat': '', 'fromLng' : ''};
    var options = {
        componentRestrictions: {country: "us"}
    };
    var inputFrom = document.getElementById('from');
    var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);
    google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
        var place = autocompleteFrom.getPlace();
        $scope.userlocation.fromLat = place.geometry.location.lat();
        $scope.userlocation.fromLng = place.geometry.location.lng();
        $scope.userlocation.from = place.formatted_address;
        $scope.$apply();

        locationService.location = place.formatted_address;
        locationService.lat = place.geometry.location.lat();
        locationService.lon = place.geometry.location.lng();
    });
}]);

// Services
weatherApp.service('locationService', function() {
    this.location = "";
    this.lat = "";
    this.lon = "";
});