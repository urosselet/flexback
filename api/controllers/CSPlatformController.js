/**
 * Cs_platformController
 *
 * @description :: Server-side logic for managing cs_platforms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
            index: 'operation',
            type: req.param('type'),
            from : 0, 
            size : 200,
            body: {  
                query: {
                    'match_all' : {}
                }
            }
        }, function(err, results) {
        	return res.json(results.hits.hits);
        });

	}

};

