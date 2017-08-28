'use strict';

angular.module('flexcrowd.controllers', [])

.controller('IndexCtrl', ['$scope', '$state', 'ESService',
    function($scope, $state, ESService) {

    	$scope.platforms = [];
    	$scope.categories = [];

    	if (angular.isDefined($state.params.menu)) {

    		ESService.findAll('categories').then(function (res) {
	           $scope.categories = res;
	        }, function (error) {
	            console.log(error);
	        });

    	} else {
    		ESService.findAll('platform').then(function (res) {
	           $scope.platforms = res;
	        }, function (error) {
	            console.log(error);
	        });
    	}

    }

]);
