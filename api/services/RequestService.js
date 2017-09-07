let replace = require('deep-replace-in-object');

/**
 * [exports description]
 * @type {Object}
 */
module.exports = {

	SEARCH: {
        'index': 'operation',
        'type': 'category',
        'from': 0,
        'size': 1,
        'body': {
            'query': {
                'multi_match': {
                    'query': '%query',
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
                    'text': '%query',
                    'phrase': {
                        'field': 'did_you_mean'
                    }
                }
            },
            'query': {
                'multi_match': {
                    'query': '%query',
                    'fields': ['description', 'title']
                }
            }
        }
    },

    interpolate: function(query, value) {
    	return replace('%query', value, this[query]);
    }

}