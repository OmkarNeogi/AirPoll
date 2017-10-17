// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

// Routing
weatherApp.config(function ($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: './templates/home.htm',
            controller: 'homeController'
        })
        .when('/aqi', {
            templateUrl: './templates/aqi.htm',
            controller: 'aqiController'
        })
});

//Controllers
weatherApp.controller('aqiController', ['$scope', '$resource', 'locationService', '$http', function($scope, $resource, locationService, $http) {
    $scope.locationService = locationService;

    if (locationService.location !== '') {
        var interpretation_dict = function(aqi) {
            var result;
            switch (true){
                case (aqi<=50):
                    result = {
                        'Rating':aqi,
                        'Level': 'Good',
                        'Health Implication': 'Air quality is considered satisfactory, and air pollution poses little or no risk.'
                    }
                    break;
                case (aqi<=100):
                    result = {
                        'Rating':aqi,
                        'Level': 'Moderate',
                        'Health Implication': 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.'
                    }
                    break;
                case (aqi<=150):
                    result = {
                        'Rating':aqi,
                        'Level': 'Unhealthy for Sensitive Groups',
                        'Health Implication': 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.'
                    }
                    break;
                case (aqi<=200):
                    result = {
                        'Rating':aqi,
                        'Level': 'Unhealthy',
                        'Health Implication': 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.'
                    }
                    break;
                case (aqi<=300):
                    result = {
                        'Rating':aqi,
                        'Level': 'Very Unhealthy',
                        'Health Implication': 'Health warnings of emergency conditions. The entire population is more likely to be affected.'
                    }
                    break;
                case (aqi>300):
                    result = {
                        'Rating':aqi,
                        'Level': 'Hazardous',
                        'Health Implication': 'Health alert: everyone may experience more serious health effects.'
                    }
                    break;
            }
            return result;
        };

        $http({
            method : "GET",
            url : "https://api.waqi.info/feed/geo:"+locationService.lat+";"+locationService.lon+"/?token=16e4230ac9315d3be1ea58b6565da8bfb7b77f87"
        }).then(function mySuccess(response) {
            console.log(response);
            console.log(response.data.data.aqi);

            var result = interpretation_dict(response.data.data.aqi);
            console.log(result);
            $scope.aqiResult = {
                'status': response.status,
                'result': result
            };

        }, function myError(response) {
            console.log('aqicontroller error: '+response);
            $scope.myWelcome = response.statusText;
        });
    }



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