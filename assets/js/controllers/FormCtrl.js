'use strict';

angular.module('flexcrowd.controllers')

.controller('FormCtrl', ['$scope', '$state', '$timeout', 'platform', 'ESService',
    function($scope, $state, $timeout, platform, ESService) {

        $scope.formData = new FormData();
    	$scope.platform = null;
    	$scope.attributes = null;

    	$scope.platform = platform.platform;
    	$scope.attributes = platform.attributes;

        $scope.$on('fileSelected', function(event, args) {
            $scope.$apply(function() {
                $scope.file = args.file;
                $scope.formData.append('image', args.file);
            });
        });

    	$scope.update = function(updatedPlatform, attributes) {

            $scope.formData.append('platform', updatedPlatform._source);
            $scope.formData.append('attributes',attributes);

    		ESService.update($state.params.id, $scope.formData)
	    		.then(function(res) {
                    $state.reload();
                });
    	};

    }

]);