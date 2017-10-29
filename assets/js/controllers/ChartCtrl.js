'use strict';

angular.module('flexcrowd.controllers')

.controller('ChartCtrl', ['$scope', '$state', 'chartsArray',
    function($scope, $state, chartsArray) {

    	$scope.chartsArray = chartsArray;

        $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
        $scope.data = [300, 500, 100];

        $scope.options = {
        	pieceLabel: {
        		render: 'percentage',
        		precision: 1
        	},
	        legend: {
	            display: true,
	            labels: {
	                fontColor: '#888'
	            }
	        }
	    };

    }

]);