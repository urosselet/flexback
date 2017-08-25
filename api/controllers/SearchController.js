/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let elasticsearch = require('elasticsearch');
let client = new elasticsearch.Client({
    host: 'http://localhost:9200',
    // log: 'trace',
    apiVersion: '5.5',
    sniffOnStart: true,
    sniffInterval: 60000
});

module.exports = {

    find: function(req, res) {

        console.log

        client.search({
            index: 'operations',
            q: req.param('query')
        }, function(err, results) {
        	return res.json(results.hits);
        });

    }

};