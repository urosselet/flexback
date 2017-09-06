/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const { Flexcrowd } = require('flx-process');
const flexClient = Flexcrowd.init({ file: 'flow.yml' });

let elasticsearch = require('elasticsearch');

let client = new elasticsearch.Client({
    host: 'http://localhost:9200',
    apiVersion: '5.5',
    sniffOnStart: true,
    sniffInterval: 60000
});

module.exports = {

    find: function(req, res) {

        client.search({
            'index': 'operation',
            'type': 'category',
            'from': 0,
            'size': 1,
            'body': {
                'query': {
                    "multi_match": {
                        'query':  req.param('query'),
                        'type':   'most_fields', 
                        'fields': [ 'cat_name^10', 'cat_name.std' ]
                    }
                }
            }
        }, function(err, results) {

            sails.log.info('Found category :: ', results.hits.hits[0]._source.category);

            flexClient.assert(results.hits.hits[0]._source.category, function(result) {
                return res.json(result);
            });

        });

    },

    /**
     * Autocomplete search
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    complete: function(req, res) {

        client.search({
            'index': 'operation',
            'type': 'platform',
            'body': {
                'suggest': {
                    'didYouMean': {
                        'text': req.param('query'),
                        'phrase': {
                            'field': 'did_you_mean'
                        }
                    }
                },
                'query': {
                    'multi_match': {
                        'query': req.param('query'),
                        'fields': ['description', 'title']
                    }
                }
            }
        }, function(err, results) {

            let response = [];

            return res.json(results.suggest.didYouMean[0].options);

        });
    },

    conversion: function(req, res) {

        client.search({
            index: 'operation',
            type: 'conversion',
            body: {
                'filtered': {
                    'filter': {
                        'term': {
                            'session': 8392371938321
                        }
                    }
                }
            }
        }, function(error, response) {
            return res.json(response)
        });
    }

};