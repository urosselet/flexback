'use strict';

angular.module('flexcrowd',
    [   
        'restangular',
        'xeditable',
        'smart-table',
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
                url: '',
                abstract: true,
                templateUrl: '/templates/index.html',
            })

            .state('index.list', {
                url: '/list/:item',
                templateUrl: '/templates/_lists/platform_list.html',
                controller: 'IndexCtrl',
                resolve: {
                    results: function(ESService, $stateParams) {
                        return ESService.findAll($stateParams);
                    }
                }
            })

            .state('index.form', {
                url: '/platform/:id',
                templateUrl: '/templates/_forms/platform_edit.html',
                controller: 'FormCtrl',
                resolve: {
                    platform: function(ESService, $stateParams) {
                        return ESService.findOne($stateParams);
                    }
                }
            })

            .state('index.platform', {
                url: '/platform/add',
                templateUrl: '/templates/_forms/platform_edit.html',
                controller: 'CreateCtrl',
                resolve: {
                    attributes: function(ESService) {
                        return ESService.getAttributes();
                    }
                }
            })


        /* If none of the above states are matched, use this as the fallback */
        $urlRouterProvider.otherwise('/list/platform');

    }

]);
