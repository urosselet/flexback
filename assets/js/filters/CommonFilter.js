'use strict';

angular.module('flexcrowd.filters', [])

.filter('booleanTransform', ['$filter',
    function($filter) {

        return function(data) {
            if (data === 1) {
            	return true;
            } else if (data === '') {
				return false;
            }
        };

    }
]);