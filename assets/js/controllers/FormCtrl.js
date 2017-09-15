'use strict';

angular.module('flexcrowd.controllers')

.controller('FormCtrl', ['$scope', '$state', '$timeout', 'ESService',
    function($scope, $state, $timeout, ESService) {

    	$scope.platform = null;
    	$scope.attributes = null;

    	ESService.findOne($state.params.id)
    		.then(function(res) {
    			$scope.platform = res.platform;
    			$scope.attributes = res.attributes;
    		});

    		
    	$scope.update = function(updatedPlatform, attributes) {

    		ESService.update($state.params.id, attributes)
	    		.then(function(res) {
	    			
	    		});
    	};

    }

]);