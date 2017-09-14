'use strict';

angular.module('flexcrowd.controllers')

.controller('FormCtrl', ['$scope', '$state', '$timeout', 'ESService',
    function($scope, $state, $timeout, ESService) {

    	$scope.platform = null

    	ESService.findOne($state.params.id)
    		.then(function(res) {
    			$scope.platform = res;
    		});


    }

]);