'use strict';

angular.module('flexcrowd',
    [   
        'restangular',
        'xeditable',
        'ui.router',
        'flexcrowd.directives',
        'flexcrowd.controllers',
        'flexcrowd.services'
    ])

.run(['$rootScope', '$window', 'editableOptions',
    function($rootScope, $window, editableOptions) {

        editableOptions.theme = 'bs3';

        $rootScope.$on('$viewContentLoaded', function() {
            $window.scrollTo(0, 0);
        });
        
    }

 ])

.config(['$stateProvider', '$urlRouterProvider', '$logProvider', 'RestangularProvider',
    function($stateProvider, $urlRouterProvider, $logProvider, RestangularProvider) {

        RestangularProvider.setBaseUrl('http://localhost:1338');

        $logProvider.debugEnabled(false);

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '/templates/index.html',
                controller: 'IndexCtrl',
            })

        /* If none of the above states are matched, use this as the fallback */
        $urlRouterProvider.otherwise('/');

    }

]);
