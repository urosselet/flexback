let replace = require('deep-replace-in-object');

/**
 * [exports description]
 * @type {Object}
 */
module.exports = {

    PLATFORM: {
        'index': 'operation',
        'type': 'platform',
        'body': {
            'query': {
                'multi_match': {
                    'query': '{{query}}',
                    'type': 'most_fields', 
                    'fields': ['description']
                }
            }
        }
    },

	SEARCH: {
        'index': 'operation',
        'type': 'category',
        'from': 0,
        'size': 1,
        'body': {
            'query': {
                'multi_match': {
                    'query': '{{query}}',
                    'type': 'most_fields', 
                    'fields': ['cat_name^10', 'cat_name.std']
                }
            }
        }
    },

    AUTOCOMPLETE: {
        'index': 'operation',
        'type': 'platform',
        'body': {
            'suggest': {
                'didYouMean': {
                    'text': '{{query}}',
                    'phrase': {
                        'field': 'did_you_mean'
                    }
                }
            },
            'query': {
                'multi_match': {
                    'query': '{{query}}',
                    'fields': ['description', 'title']
                }
            }
        }
    },

    PROCESS: {
        'index': 'operation',
        'type': '{{type}}',
        'from': 0,
        'size': 200,
        'body': {
            'query': {
                'match_all': {}
            }
        }
    },

    interpolate: function(query, template, value) {
    	return replace(template, value, this[query]);
    }

}