'query': {
    'match': {
        'description': {
            'query': req.param('query'),
            'operator': 'or'
        }
    }
},
'suggest': {
    'my-suggestion': {
        'text': req.param('query'),
        'term': {
            'field': 'description'
        }
    }
}

/* ---------------------------------- */
/* ---------------------------------- */

'query': {
    'multi_match': {
        'query': req.param('query'),
        'fields': ['cat_name^2', 'tags'],
        'type': 'cross_fields'
    }
}

/* ---------------------------------- */
/* ---------------------------------- */

client.index({
    'index': 'operation',
    'type': 'session',
    'id': req.param('session'),
    'body': {
        'info': 'session of ' + req.param('session')
    }
}, function(error, response) {

    client.index({
        'index': 'operation',
        'type': 'conversation',
        'body': {
            'session': response._id,
            'query': req.param('query')
        }
    }, function(error, response) {
        // console.log(error, response)
    });

});

/* ---------------------------------- */
/* ---------------------------------- */

client.search({
    'index': 'operation',
    'type': 'platform',
    'body': {
        'query': {
            'multi_match': {
                'query': req.param('query'),
                'fields': ['description', 'title']
            }
        },
        'suggest': {
            'didYouMean': {
                'text': req.param('query'),
                'phrase': {
                    'field': 'did_you_mean'
                }
            }
        },
    }
}, function(err, results) {

    let response = [];

    if (!results.hits.hits) {
        response = results.hits.hits;
    }

    return res.json({
        'answer': questions[Math.floor(Math.random() * 2) + 0],
        'results': results.hits.hits
    });

});