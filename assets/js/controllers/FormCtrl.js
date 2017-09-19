'use strict';

angular.module('flexcrowd.controllers')

.controller('FormCtrl', ['$scope', '$state', '$timeout', 'platform', 'ESService',
    function($scope, $state, $timeout, platform, ESService) {

        let formData = new FormData();
        let contentArray = [];

    	$scope.platform = null;
    	$scope.attributes = null;

    	$scope.platform = platform.platform;
    	$scope.attributes = platform.attributes;

        $scope.$on('fileSelected', function(event, args) {
            $scope.$apply(function() {
                contentArray.push({ 'file': args.file });
            });
        });

    	$scope.update = function(updatedPlatform, attributes) {

            formData.append('file', contentArray[0]['file']);
            formData.append('platform', JSON.stringify(updatedPlatform._source));
            formData.append('attributes', JSON.stringify(attributes));

    		ESService.update($state.params.id, formData)
	    		.then(function(res) {
                    $state.reload();
                });
    	};

    }

]);