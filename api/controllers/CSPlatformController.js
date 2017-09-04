/**
 * Cs_platformController
 *
 * @description :: Server-side logic for managing cs_platforms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

    find: function(req, res) {
        ESClientService.process({
            'type': req.param('type')
        }, function(result) {
            return res.json(result);
        });
    },

    /**
     * Data import to populate ES
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    import: function(req, res) {
        ESClientService.import({}, function(result) {
            console.log(result)
            return res.ok();
        });
    }

};