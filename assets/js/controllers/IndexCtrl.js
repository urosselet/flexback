'use strict';

angular.module('flexcrowd.controllers', [])

.controller('IndexCtrl', ['$scope', '$state', 'ESService',
    function($scope, $state, ESService) {

    	$scope.platforms = [];

    	ESService.findAll().then(function (res) {
           $scope.platforms = res;
        }, function (error) {
            console.log(error);
        });

    }

]);
