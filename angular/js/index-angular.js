'use strict';

var gdaApp = angular.module('gdaApp', ['ngRoute']);

/**
   Note that these routes need a hash prefix - http://mycom.com/#/home
*/
gdaApp.config(function ($routeProvider, $locationProvider) {
    /*
      This example uses sessionStorage so that the back button returns us
      to the expected state. We could also use localStorage, which would
      allow for different tabs to share data.

      This technique does not require Angular, only window.sessionStorage
      and some thoughtful coordination of asynchronous events.
    */
    $routeProvider.when('/', {
        templateUrl: 'pages/home.html',
        controller: 'mainController'
    }).when('/home', {
        templateUrl: 'pages/home.html',
        controller: 'mainController'
    }).when('/about', {
        templateUrl: 'pages/about.html',
        controller: 'aboutController'
    }).when('/contact', {
        templateUrl: 'pages/contact.html',
        controller: 'contactController'
    }).when('/movies', {
        templateUrl: 'pages/movies.html',
        controller: 'moviesController'
    });

});

gdaApp.controller('mainController', ['$scope', '$http', function ($scope, $http) {
    $scope.message = 'Don\'t bother us!';
    $http.jsonp('https://www.omdbapi.com/?callback=JSON_CALLBACK&s=Night%20of%20the%20Hunter&type=movie&tomatoes=true').success(function (json) {
        console.log('right here');
        $scope.message = JSON.stringify(json);
    }).error(function (err) {
        console.log(err);
    });
}]);

gdaApp.controller('aboutController', function ($scope) {
    $scope.message = 'About time!';
});

gdaApp.controller('contactController', function ($scope) {
    $scope.message = 'Don\'t bother us!';
});

// Add $window to access sessionStorage.
gdaApp.controller('moviesController', ['$scope', '$window', 'dataModel', function ($scope, $window, dataModel) {
    var stateKey = 'state';

    // See http://code.notsoclever.cc/column-and-row-based-tables-in-angularjs/

    $scope.click = function (stock) {
        if (stock.checked) {
            $scope.tickers[stock.id] = $scope.data[stock.id];
        } else {
            delete $scope.tickers[stock.id];
        }
        $window.sessionStorage.setItem(stateKey, JSON.stringify($scope.stocks));
    };

    // Update our stock data before rendering the view.
    dataModel.update().then(function () {
        // Look for state changes from current session.
        var state = $window.sessionStorage.getItem(stateKey);

        $scope.tickers = {};
        $scope.keys = dataModel.getKeys();
        $scope.labels = dataModel.getLabels();

        $scope.data = dataModel.getData();
        if (state) {
            // Use checked states from current session.
            $scope.stocks = JSON.parse(state);
        } else {
            // Otherwise, use default checked states.
            $scope.stocks = dataModel.getState();
        }
        $scope.stocks.map(function (stock) {
            if (stock.checked) {
                $scope.tickers[stock.id] = $scope.data[stock.id];
            }
        });
    });

}]);

/**
   Use service instead of factory to make it a singleton.
*/
gdaApp.service('dataModel', ['$http', function ($http) {
    var stateKey = 'state',
        stocks = [],
        data = {},
        keys, labels;

    keys = ['open', 'high', 'low', 'last_trade', 'volume', '52_week_high', 'market_cap'];
    labels = {
        open: 'Open',
        high: 'High',
        low: 'Low',
        last_trade: 'Last',
        market_cap: 'Market Cap',
        pe_ratio: 'PE',
        eps: 'EPS',
        volume: 'Volume',
        '52_week_high': '52 Week High',
        dividend: 'Dividend',
        eps_est_annual: 'EPS Annual Estimate'
    };

    /**
       Fetch stocks and data.
       @returns Promise.
    */
    function update() {
        return $http.get('stock-data.json')
            .then(function (res) {
                var stockData = res.data;
                for (var stock in stockData) {
                    data[stock] = stockData[stock];
                }
            })
            .then(function () {
                return $http.get('stocks.json');
            })
            .then(function (res) {
                res.data.forEach(function (value) {
                    stocks.push(value);
                });
            });
    }

    return {
        update: update,
        getKeys: function () {
            return keys;
        },
        getLabels: function () {
            return labels;
        },
        getState: function () {
            return stocks;
        },
        getData: function () {
            return data;
        }
    };
}]);
