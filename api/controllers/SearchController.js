/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const { Flexcrowd } = require('flx-process');
const flexClient = Flexcrowd.init({ 'file': 'flow.yml' });

let client = sails.config.es.client;

module.exports = {

    /**
     * Full text search
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    find: function(req, res) {

        let query = req.param('query');

        ESClientService.query({ 'type': 'SEARCH', 'query': query })
            .then(function(queryResults) {

                ESClientService.query({ 'type': 'PLATFORM', 'query': query })
                    .then(function(platformResults) {

                        let maxScore = platformResults.hits.max_score;
                        let mediumHits = [];
                        let highHits = [];

                        platformResults.hits.hits.forEach(function(ele) {
                            ele._source['id'] = ele._id;
                            if (ele._score > ((maxScore / 100) * 85)) {
                                highHits.push(ele._source);
                            } else if (ele._score < ((maxScore / 100) * 85)) {
                                mediumHits.push(ele._source);
                            }
                        });

                        return res.json({'results': { 'medium_hits': mediumHits, 'high_hits': highHits }, 'cat': queryResults.hits.hits[0]._source.cat_name });

                    });

            });
    },

    /**
     * Autocomplete query search
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    complete: function(req, res) {
        ESClientService.autocomplete({ 'query': req.param('query') })
            .then(function(result) {
                return res.json(result.suggest.didYouMean[0].options);
            });
    },

    /**
     * Filter platforms by attributes
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    platforms: function(req, res) {

        let queryFilter = [];
        let str = 'attributes.';

        req.body.forEach(function(activities) {

            activities.forEach(function(characteristics) {

                Object.keys(characteristics).forEach(function(index) {
                    
                    Object.keys(characteristics[index]).forEach(function(attribute) {

                        let filterKey = str.concat(index).concat('.').concat(attribute);
                        let filterObject = {};

                        filterObject[filterKey] = characteristics[index][attribute];

                        queryFilter.push({ 'term': filterObject });
                    });
                    
                });

            });

        });

        let query = {
            'nested': {
                'path': 'attributes',
                'query': {
                    'bool': {
                        'filter': queryFilter
                    }
                }
            }
        };

        console.log(query.nested.query.bool.filter);

        client.search({
            'index': 'operation',
            'type': 'platform',
            'body': { 'query': query }
        }).then(function(results) {

            let highHits = [];

            results.hits.hits.forEach(function(hit) {
                highHits.push(hit._source);
            });

            return res.json({ 'results': { 'high_hits': highHits } });

        });

    }

};
