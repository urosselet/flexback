'use strict';

angular.module('flexcrowd.directives', [])

.directive('treeDiagram', ['$timeout',
    function($timeout) {
        return {
            scope: true,
            link: function($scope, el, attrs) {

                let simple_chart_config = {

                    chart: {
                        container: '#tree-diagram',
                        rootOrientation: 'WEST',
                    },

                    nodeStructure: {
                        text: {
                            name: 'get_ideas_and_solutions_to_specific_questions'
                        },
                        children: [
                            {
                                collapsable: true,
                                text: {
                                    name: 'New ideas'
                                },
                                children: [
                                    {
                                        text: {
                                            name: 'New product or services'
                                        },
                                    },
                                    {
                                        text: {
                                            name: 'Enhance product or services'
                                        },
                                    }
                                ]
                            }, 
                            {   
                                collapsable: true,
                                text: {
                                    name: 'Solution to specific problem'
                                },
                                children: [
                                    {
                                        text: {
                                            name: 'New product or services'
                                        },
                                    },
                                    {
                                        text: {
                                            name: 'Enhance product or services'
                                        },
                                    }
                                ]
                            }
                        ]
                    }
                };

                new Treant(simple_chart_config);

            }
        }
    }

]);