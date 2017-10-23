'use strict';

angular.module('flexcrowd.filters', [])

.filter('booleanTransform', ['$filter',
    function($filter) {

        return function(data) {
            if (data === true || data === 'true') {
                return 'true';
            } else if (data === false || data === 'false') {
                return 'false';
            }
        };

    }
])

.filter('clusterText', ['$filter',
    function($filter) {

        return function(cluster) {

            switch (cluster) {
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
])

.filter('idToText', ['$filter',
    function($filter) {

        return function(id) {

            const text = {
                'process': 'Process',
                'goal': 'Goal',
                'task': 'Task',
                'crowd': 'Crowd',
                'initiator': 'Initiator',
                'cost_reduction': 'Cost reduction',
                'innovation': 'Innovation',
                'risk_reduction': 'Risk reduction',
                'high': 'High',
                'low': 'Low',
                'authenticity': 'Authenticity',
                'crowd_community': 'Crowd community',
                'innovation': 'Innovation',
                'contribution_type': 'Contribution type',
                'main_motivational_driver': 'Motivator type',
                'input_tolerance': 'Input tolerance',
                'main_beneficiary': 'Main beneficiary',
                'value_type': 'Value type',
                'dependencies': 'Dependencies',
                'type': 'Type',
                'content': 'Content',
                'tangible_reward': 'Tangible reward',
                'coupled': 'Coupled',
                'decoupled': 'Decoupled',
                'creation': 'Creation',
                'evaluation': 'Evaluation',
                'organization': 'Organization',
                'personal_achievement_and_learning': 'Personal achievement and learning',
                'social_status_and_reputation': 'Social status and reputation',
                'entertainment': 'Entertainment',
                'aggregation_of_contributions': 'Aggregation of contributions',
                'form_of_remuneration': 'Form of remuneration',
                'peer_contributions_accessibility': 'Accessibility of peer contributions',
                'preselection_of_contributors': 'Preselection of contributors',
                'remuneration_for_contributions': 'Remuneration for contributions type',
                'qualification_based': 'Qualification-based',
                'context_specific': 'Context specific',
                'both': 'Both',
                'modify': 'Modify',
                'assess': 'Assess',
                'view': 'View',
                'integrative': 'Integrative',
                'selective': 'Selective',
                'fixed': 'Fixed',
                'success_based': 'Success-based',
                'none': 'None',
                'token': 'Token',
                'visibility': 'Visibility',
                'market': 'Market',
            };

            return text[id];

        };

    }
])

.filter('unique', function() {
    return function(arr, field) {
        var o = {},
            i, l = arr.length,
            r = [];
        for (i = 0; i < l; i += 1) {
            o[arr[i]._source[field]] = arr[i];
        }
        for (i in o) {
            r.push(o[i]);
        }
        return r;
    };
})

.filter('strictFilter', function($filter) {
    return function(input, predicate) {
        return $filter('filter')(input, predicate, true);
    }
});