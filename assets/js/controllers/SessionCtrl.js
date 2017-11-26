'use strict';

angular.module('flexcrowd.controllers')

.controller('SessionCtrl', ['$scope', '$state', 'sessions',
    function($scope, $state, sessions) {

    	$scope.sessions = sessions;

    }

]);