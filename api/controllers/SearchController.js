/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const { Flexcrowd } = require('flx-process');
const flexClient = Flexcrowd.init({ file : 'flow.yml' });

let elasticsearch = require('elasticsearch');

let client = new elasticsearch.Client({
    host: 'http://localhost:9200',
    apiVersion: '5.5',
    sniffOnStart: true,
    sniffInterval: 60000
});

module.exports = {

    find: function(req, res) {

        let questions = [
            'How would you like to innovate?',
            'Would you a new logo or review the existing one?',
            'How to compensate the contributors?'
        ];

        client.index({
            index: 'operation',
            type: 'session',
            id: req.param('session'),
            body: {
                info: 'session of ' + req.param('session')
            }
        }, function (error, response) {

            client.index({
                index: 'operation',
                type: 'conversation',
                body: {
                    session: response._id,
                    query: req.param('query')
                }
            }, function (error, response) {
                // console.log(error, response)
            });
        });

        flexClient.assert(req.param('query'), function(res) {
            
        });

        client.search({
            'index': 'operation',
            'type': 'category',
            'body': {
                'query': {
                    'match': {
                        'description': {
                            'query': req.param('query'),
                            'operator': 'or',
                            'minimum_should_match': '25%'
                        }
                    }
                }
            }
        }, function(err, results) {

            
                        
        });

        client.search({
            'index': 'operation',
            'type': 'platform',
            'body': {
                'query': {
                    'match': {
                        'description': {
                            'query': req.param('query'),
                            'operator': 'and',
                            'minimum_should_match': '25%'
                        }
                    }
                }
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

    },

    conversion: function(req, res) {

        client.search({
          index: 'operation',
          type: 'conversion',
          body: {
            'filtered': {
              'filter': {
                'term': { 'session': 8392371938321 }
              }
            }
          }
        }, function (error, response) {
            return res.json(response)
        });
    }

};