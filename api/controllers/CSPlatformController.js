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