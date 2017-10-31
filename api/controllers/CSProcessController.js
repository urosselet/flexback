let client = sails.config.es.client;

/**
 * CSProcessController
 *
 * @description :: Server-side logic for managing Csprocesses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

	/**
	 * Find all CS processes
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	find: function(req, res) {
        client.search({ 
            'index': 'operation', 
            'type': 'cs_process', 
            'body': { 'query': { 'match_all': {} } }
        }).then(function(results) {
            return res.json(results.hits.hits);
        });
	},

	/**
	 * Find one CS Process based on it's ID
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	findOne: function(req, res) {
		client.get({ index: 'operation', type: 'cs_process', id: req.param('id') })
            .then(function(csprocess) {
                return res.json(csprocess)
            });
	}

};

