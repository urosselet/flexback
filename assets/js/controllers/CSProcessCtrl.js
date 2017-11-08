'use strict';

angular.module('flexcrowd.controllers')

.controller('CSProcessCtrl', ['$scope', '$state', 'csprocess', 'ESService',
    function($scope, $state, csprocess, ESService) {

    	if (typeof $state.params.id === 'undefined') {
        	$scope.csprocesses = csprocess;
        } else {
        	$scope.csprocess = csprocess;
        }

        $scope.save = function(object) {
        	ESService.updateCSProcess($state.params.id, object)
        		.then(function() {
                    $state.go('index.csprocess');
        		});
        };

    }

]);