let client = sails.config.es.client,
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    WAE = require('web-auto-extractor').default,
    request = require('request');

let summarize = require('summarize');
let superagent = require('superagent');
let extractor = require('node-article-extractor');
let scrappy = require('@mrharel/scrappy');
let ineed = require('ineed');
let G = require('generatorics');
var glossary = require('glossary');

/**
 * Cs_platformController
 *
 * @description :: Server-side logic for managing cs_platforms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

    extract: function(req, res) {

        /*for (var prod of G.cartesian(['Innovation', 'Authenticity', 'Cost Reduction'], ['Integrative', 'Selective'], ['Qualification-based', 'Context-specific'])) {
           console.log(prod);
        }*/

        request(req.param('url'), function (error, response, body) {
            
            let data = extractor(body);

            let platform = {
                _source: {
                    'title': data.title,
                    'softTitle': data.softTitle,
                    'name': data.publisher,
                    'description': data.description,
                    'platform_img_url': data.image,
                    'keywords': data.keywords,
                    'tags': data.tags,
                    'text': data.text,
                    'generated_keywords': glossary.extract(data.description)
                }
            }

            ineed.collect.texts
                .from(req.param('url'), function (err, response, result) {
                    console.log('************** extractor ************');
                    console.log(data);
                    console.log('************** INeed ************');
                    console.log(result);
                    platform._source['raw_data'] = result.texts;
                    return res.json(platform);
                });

        });

    },

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
     * Add a new platform to ES Index
     * @return {[type]} [description]
     */
    create: function(req, res) {

        req.file('file').upload({}, function(err, file) {
            
            let platform = JSON.parse(req.body.platform);

            if (file.length !== 0) {
                let uploadFolder = path.join(path.dirname(process.mainModule.filename), `/assets/upload/${file[0].filename}`);
                let logoUrl = util.format(`%s/upload/${file[0].filename}`, sails.config.asset_url);

                platform.body.platform_img_url = logoUrl;

                fs.rename(file[0].fd, uploadFolder, function(err) {
                    if (err) return sails.log.error(err);
                    sails.log.info('The file was saved!');
                });
            }

            client.create({
                'index': 'operation',
                'type': 'platform',
                'id': platform._id,
                'body': platform.body
            }, function(error, response) {
                if (error) return res.serverError();
                return res.ok()
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

            if (file.length !== 0) {
                let uploadFolder = path.join(path.dirname(process.mainModule.filename), `/assets/upload/${file[0].filename}`);
                let logoUrl = util.format(`%s/upload/${file[0].filename}`, sails.config.asset_url);

                platform.platform_img_url = logoUrl;

                fs.rename(file[0].fd, uploadFolder, function(err) {
                    if (err) return sails.log.error(err);
                    sails.log.info('The file was saved!');
                });
            }

            client.index({
                'index': 'operation',
                'type': 'platform',
                'id': req.param('id'),
                'body': platform
            }, function(errorCreate, resIndex) {
                client.update({
                    'index': 'operation',
                    'type': 'platform',
                    'id': req.param('id'),
                    'body': {
                        'doc': {
                            'attributes': attributes
                        }
                    }
                }, function(errorUpdate, resUpdate) {
                    if (errorUpdate) return res.serverError();
                    return res.ok()
                });

            });

        });

    },

    /**
     * Get platform source
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    getPlatformDetail: function(req, res) {
        client.get({ index: 'operation', type: 'platform', id: req.param('id') })
            .then(function(platform) {
                return res.json(platform._source);
            });
    },

    /**
     * Get all attributes
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    getAttributes: function(req, res) {
        ESClientService.getAllAttributes({}, function(attributes) {
            return res.json(attributes);
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