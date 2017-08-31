'use strict';

angular.module('flexcrowd',
    [   
        'restangular',
        'xeditable',
        'ui.router',
        'flexcrowd.directives',
        'flexcrowd.filters',
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

        switch(window.location.host) { 
            case 'localhost:1338':
                RestangularProvider.setBaseUrl('http://localhost:1338');
                break;
            case 'flexcrowd.org:8082':
                RestangularProvider.setBaseUrl('http://flexcrowd.org:8082');
                break;
        }

        $logProvider.debugEnabled(false);

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '/templates/index.html',
                controller: 'IndexCtrl',
            })

            .state('menu', {
                url: '/:menu',
                templateUrl: '/templates/index.html',
                controller: 'IndexCtrl',
            })

        /* If none of the above states are matched, use this as the fallback */
        $urlRouterProvider.otherwise('/');

    }

]);
