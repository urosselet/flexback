let client = sails.config.es.client;

/**
 * CSActivityController
 *
 * @description :: Server-side logic for managing Csactivities
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
            'type': 'cs_activity',
            'body': { 'query': { 'match_all': {} }, 'sort': [ { 'index': { 'order': 'asc' } } ] }
        }).then(function(results) {
            return res.json(results.hits.hits);
        });
    },

    /**
     * Update a CS Process based on its id
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    update: function(req, res) {
        client.update({ index: 'operation', type: 'cs_activity', id: req.param('id'), body: { doc: req.body } })
            .then(function(csactivity) {
                return res.json(csactivity._source);
            });
    },

    /**
     * Get CS Activities wizard array
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    wizard: function(req, res) {
        client.search({
            'index': 'operation',
            'type': 'cs_activity',
            'body': { 'query': { 'match_all': {} }, 'sort': [ { 'index': { 'order': 'asc' } } ] }
        }).then(function(results) {
            let csactivityArray = [];
            results.hits.hits.forEach(function(csactivity) {
                let csactivityObj = {
                    'id': csactivity._id,
                    'activity_name': csactivity._source.activity_name,
                    'icon': csactivity._source.icon,
                    'label': csactivity._source.data.label,
                    'activities': csactivity._source.data.activities
                };
                csactivityArray.push(csactivityObj);
            });
            return res.json(csactivityArray);
        });
    }
	
};
