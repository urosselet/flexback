/**
 * Cs_platformController
 *
 * @description :: Server-side logic for managing cs_platforms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

	find: function(req, res) {

        ESClientService.process({'type': req.param('type')}, function(result) {
            return res.json(result);
        });

	}

};

