'use strict';

angular.module('flexcrowd.controllers')

.controller('CreateCtrl', ['$scope', '$state', '$timeout', 'attributes', 'ESService',
    function($scope, $state, $timeout, attributes, ESService) {

        let formData = new FormData();
        let contentArray = [];

        $scope.context = 'create';
        $scope.attributes = attributes;

        $scope.$on('fileSelected', function(event, args) {
            $scope.$apply(function() {
                contentArray.push({ 'file': args.file });
            });
        });

        /**
         * Save new platform
         * @param  {[type]} platform      [description]
         * @return {[type]}               [description]
         */
        $scope.save = function(platform) {

            if (contentArray.length !== 0) {
                formData.append('file', contentArray[0]['file']);
            } else {
                formData.append('file', null);
            }

            let platformObj = { id: platform.id, body: platform._source };
            
            formData.append('platform', JSON.stringify(platformObj));

            ESService.create(formData)
                .then(function(res) {
                    $state.go('index.list', { 'item': 'platform' });
                });
        
        };

    }

]);