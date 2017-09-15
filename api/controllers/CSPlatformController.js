let client = sails.config.es.client;

/**
 * Cs_platformController
 *
 * @description :: Server-side logic for managing cs_platforms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

    /**
     * Get datatset base on the specified ES type
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    find: function(req, res) {
        ESClientService.process({ 'type': req.param('type') })
            .then(function(results) {
                let response = [];
                if (typeof results.hits !== 'undefined') {
                    response = results.hits.hits;
                }
                return res.json(response);
            }, function(error) {
                return res.serverError(error);
            });
    },

    /**
     * Get platform base on the specified id
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    findOne: function(req, res) {
        client.get({ index: 'operation', type: 'platform', id: req.param('id') })
            .then(function(platform) {
                ESClientService.getAllAttributes({}, function(attributes) {
                    return res.json({ 'platform': platform, 'attributes': attributes });
                });
            });
    },

    /**
     * Update a platform document
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    update: function(req, res) {

        client.update({
            'index': 'operation',
            'type': 'platform',
            'id': req.param('id'),
            'body': {
                'doc': {
                    'attributes': req.body
                }
            }
        }, function(error, response) {
            if (error) return res.serverError();
            return res.ok()
        });

    },

    /**
     * Data import to populate ES
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    import: function(req, res) {
        ESOperationService.import({}, function(err, result) {
            if (err) return res.serverError(err);
            return res.ok();
        });
    },

    /**
     * Data import to populate ES
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    export: function(req, res) {
        ESOperationService.export({}, function(err, results) {
            if (err) return res.serverError(err);
            return res.ok();
        });
    }

};