'use strict';

angular.module('flexcrowd.controllers', [])

.controller('IndexCtrl', ['$scope', '$state', '$timeout', 'results', 'ESService',
    function($scope, $state, $timeout, results, ESService) {

        $scope.platforms = [];
        $scope.categories = [];
        
        $scope.treeDiagram = false;
        $scope.alertVisible = false;
        $scope.dumpAlertVisible = false;
        $scope.exportError = false;
        $scope.importError = false;
        $scope.loadError = false;

        $scope.itemsByPage = 10;

        $scope.displayCollection = [].concat($scope.platforms);

        $scope.$on('filteredList', function(event, args) {
            $scope.itemCount = args.val.length;
        });

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
            case 'clusters':
                $scope.clusters = results;
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

        /**
         * Go to new CS platform insert view
         */
        $scope.addPlatform = function() {
            $state.go('index.platform');
        };

        /**
         * Go to CS process management view
         */
        $scope.csProcess = function() {
            $state.go('index.csprocess');
        };

        /**
         * Go to CS Activity management view
         */
        $scope.csActivity = function() {
            $state.go('index.csactivity');
        };

    }

]);