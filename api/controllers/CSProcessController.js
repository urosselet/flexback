let client = sails.config.es.client;

/**
 * CSProcessController
 *
 * @description :: Server-side logic for managing Csprocesses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

	find: function(req, res) {

        client.search({ 
            'index': 'operation', 
            'type': 'cs_process', 
            'body': { 'query': { 'match_all': {} } }
        }).then(function(results) {
            return res.json(results.hits.hits);
        });
           
	}

};

