'use strict';

angular.module('flexcrowd.controllers')

.controller('ChartCtrl', ['$scope', '$state', 'ESService',
    function($scope, $state, ESService) {

        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];


    }

]);