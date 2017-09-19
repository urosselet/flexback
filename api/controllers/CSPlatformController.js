let client = sails.config.es.client,
    fs = require('fs'),
    path = require('path'),
    util = require('util');

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

        req.file('file').upload({}, function(err, file) {

            let platform = JSON.parse(req.body.platform);
            let attributes = JSON.parse(req.body.attributes);

            let uploadFolder = path.join(path.dirname(process.mainModule.filename), `/assets/upload/${file[0].filename}`);
            let logoUrl = util.format(`%s/upload/${file[0].filename}`, sails.config.asset_url);

            platform.platform_img_url = logoUrl;

            fs.rename(file[0].fd, uploadFolder, function(err) {
                if (err) return sails.log.error(err);
                sails.log.info('The file was saved!');
            });

            client.index({
                'index': 'operation',
                'type': 'platform',
                'id': req.param('id'),
                'body': platform
            }, function(error, response) {
                client.update({
                    'index': 'operation',
                    'type': 'platform',
                    'id': req.param('id'),
                    'body': {
                        'doc': {
                            'attributes': attributes
                        }
                    }
                }, function(error, response) {
                    if (error) return res.serverError();
                    return res.ok()
                });

            });

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