'use strict';

angular.module('flexcrowd.controllers', [])

.controller('IndexCtrl', ['$scope', '$state', '$timeout', 'results',
    function($scope, $state, $timeout, results) {

        $scope.platforms = [];
        $scope.categories = [];
        
        $scope.treeDiagram = false;
        $scope.alertVisible = false;
        $scope.dumpAlertVisible = false;
        $scope.exportError = false;
        $scope.importError = false;
        $scope.loadError = false;

        /**
         * Define application state and call the corresponding api
         * @param  {[type]} $state.params.menu [description]
         * @return {[type]}                    [description]
         */
        switch ($state.params.item) {
            case 'platform':
                $scope.platforms = results;
                break;
            case 'category':
                $scope.categories = results;
                break;
            case 'tree-diagram':
                $scope.treeDiagram = true
                break;
            default:
                break;
        };

        /**
         * Import ES dataset, mappings and tokenizer
         * @return {[type]} [description]
         */
        $scope.import = function() {
            ESService.import()
                .then(function(res) {
                    $scope.alertVisible = true;
                    $timeout(function() {
                        $scope.alertVisible = false;
                    }, 5000);
                }, function(err) {
                    $scope.importError = true;
                    $timeout(function() {    
                        $scope.importError = false;
                    }, 5000);
                });
        };

        /**
         * Import ES dataset, mappings and tokenizer
         * @return {[type]} [description]
         */
        $scope.export = function() {
            ESService.export()
                .then(function(res) {
                    $scope.dumpAlertVisible = true;
                    $timeout(function() {
                        $scope.dumpAlertVisible = false;
                    }, 5000);
                }, function(err) {
                    $scope.exportError = true;
                    $timeout(function() {
                        $scope.exportError = false;
                    }, 5000);
                });
        };

    }

]);