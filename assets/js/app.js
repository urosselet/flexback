'use strict';

angular.module('flexcrowd',
    [
        'ngAnimate',
        'ngSanitize',
        'restangular',
        'xeditable',
        'smart-table',
        'ui.router',
        'toaster',
        'angular-loading-bar',
        'chart.js',
        'ui.bootstrap',
        'cp.ngConfirm',
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

        switch(window.location.host) {
            case 'localhost:1338':
                $rootScope.assetUrl = 'http://localhost:1338/upload/';
                break;
            case 'api.flexcrowd.org':
                $rootScope.assetUrl = 'https://api.flexcrowd.org/upload/';
                break;
        }

    }

 ])

.config(['$stateProvider', '$urlRouterProvider', '$logProvider', 'RestangularProvider', 'cfpLoadingBarProvider',
    function($stateProvider, $urlRouterProvider, $logProvider, RestangularProvider, cfpLoadingBarProvider) {

        switch(window.location.host) {
            case 'localhost:1338':
                RestangularProvider.setBaseUrl('http://localhost:1338');
                break;
            case 'api.flexcrowd.org':
                RestangularProvider.setBaseUrl('https://api.flexcrowd.org');
                break;
        }

        $logProvider.debugEnabled(false);
        cfpLoadingBarProvider.includeSpinner = false;

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

            .state('index.cluster', {
                url: '/cluster/chart',
                templateUrl: '/templates/_lists/cluster_charts.html',
                controller: 'ChartCtrl',
                resolve: {
                    chartsArray: function(ESService) {
                        return ESService.getChartsArray();
                    }
                }
            })

            .state('index.csprocess', {
                url: '/cs_process',
                templateUrl: '/templates/_lists/cs_process_list.html',
                controller: 'CSProcessCtrl',
                resolve: {
                    csprocess: function(ESService) {
                        return ESService.getCSProcess();
                    }
                }
            })

            .state('index.csprocess-edit', {
                url: '/cs_process/:id',
                templateUrl: '/templates/_forms/csprocess_edit.html',
                controller: 'CSProcessCtrl',
                resolve: {
                    csprocess: function(ESService, $stateParams) {
                        return ESService.getCSProcess($stateParams);
                    }
                }
            })

            .state('index.csactivity', {
                url: '/cs_activity',
                templateUrl: '/templates/_lists/cs_activity_list.html',
                controller: 'CSActivityCtrl',
                resolve: {
                    csactivity: function(ESService) {
                        return ESService.getCSActivity();
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

            .state('index.session', {
                url: '/sessions',
                templateUrl: '/templates/_lists/session_list.html',
                controller: 'SessionCtrl',
                resolve: {
                    sessions: function(ESService) {
                        return ESService.getSessions();
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
            });

        /* If none of the above states are matched, use this as the fallback */
        $urlRouterProvider.otherwise('/cs_activity');

    }

]);
