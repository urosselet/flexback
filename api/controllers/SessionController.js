let client = sails.config.es.client;

/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

	/**
     * Find all CS activites
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    find: function(req, res) {
        client.search({
            'index': 'operation',
            'type': 'session',
            'body': { 'query': { 'match_all': {} } }
        }).then(function(results) {
            return res.json(results.hits.hits);
        });
    }

};