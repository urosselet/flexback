'use strict';

angular.module('flexcrowd.controllers', [])

.controller('IndexCtrl', ['$scope', '$state', '$timeout', 'ESService',
    function($scope, $state, $timeout, ESService) {

        $scope.platforms = [];
        $scope.categories = [];
        $scope.alertVisible = false;
        $scope.treeDiagram = false;

        switch ($state.params.menu) {
            case 'categories':
                ESService.findAll('category')
                    .then(function(res) {
                        $scope.categories = res;
                    }, function(error) {
                        console.log(error);
                    });
                break;
            case 'tree-diagram':
                console.log('')
                $scope.treeDiagram = true
                break;
            default:
                ESService.findAll('platform')
                    .then(function(res) {
                        $scope.platforms = res;
                    }, function(error) {
                        console.log(error);
                    });

        };

        $scope.import = function() {
            ESService.import()
                .then(function(res) {
                    $scope.alertVisible = true;
                    $timeout(function() {
                        $scope.alertVisible = false;
                    }, 5000);
                });
        };

    }

]);