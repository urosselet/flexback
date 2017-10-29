'use strict';

angular.module('flexcrowd.controllers')

.controller('CSProcessCtrl', ['$scope', '$state', 'csprocess',
    function($scope, $state, csprocess) {

        $scope.csprocesses = csprocess;

    }

]);