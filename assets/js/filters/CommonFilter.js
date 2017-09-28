'use strict';

angular.module('flexcrowd.filters', [])

.filter('booleanTransform', ['$filter',
    function($filter) {

        return function(data) {
            if (data === true || data === 'true') {
            	return 'Yes';
            } else if (data === false || data === 'false') {
				return 'No';
            }
        };

    }
]);