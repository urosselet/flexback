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
])

.filter('clusterText', ['$filter',
    function($filter) {

        return function(cluster) {

            switch(cluster) {
			    case '1':
			        return '(1) Sharing authentic experiences';
			        break;
			    case '2':
			        return '(2) Relationship building through user generated content';
			        break;
		        case '3':
		        	return '(3) Curating ideas and features';
		        	break;
		        case '4':
			        return '(4) Problem solving';
			        break;
		        case '5':
			        return '(5) Ad hoc temporary hiring';
			        break;
		        case '6':
			        return '(6) Sourcing specific digital goods';
			        break;
			}

        };

    }
]);