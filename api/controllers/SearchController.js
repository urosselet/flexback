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

        if (!query) { 
            client.search({
                'index': 'operation',
                'type': 'platform',
                'from': 0,
                'size': 200,
                'body': { 'query': { 'match_all': {} } }
            }).then(function(results) {
                let mediumHits = [];
                results.hits.hits.forEach(function(ele) {
                    ele._source['id'] = ele._id;
                    mediumHits.push(ele._source);
                });
                return res.json({ 'results': { 'medium_hits': mediumHits } });
            });
            
        } else {

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
        }
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

        console.log(req.body['sessionData'])
        console.log(req.body['sessionId'])
        console.log(req.body['data'])

        client.update({
            'index': 'operation',
            'type': 'session',
            'id': req.body['sessionId'],
            'body': {
                'doc': {
                    'data': req.body['data']
                },
                "doc_as_upsert" : true
            }
        }, function() {});

        req.body['attributes'].forEach(function(activities) {

            activities.forEach(function(characteristics) {

                Object.keys(characteristics).forEach(function(index) {
                    
                    Object.keys(characteristics[index]).forEach(function(attribute) {

                        let filterKey = str.concat(index).concat('.').concat(attribute);
                        let filterObject = {};

                        filterObject[filterKey] = characteristics[index][attribute];
                        queryFilter.push({ 'match': filterObject });
                    });
                    
                });

            });

        });

        let query = {
            'nested': {
                'path': 'attributes',
                'query': {
                    'bool': {
                        'must': queryFilter
                    }
                }
            }
        };

        sails.log.info('Card filters:', query.nested.query.bool.must);

        client.search({
            'index': 'operation',
            'type': 'platform',
            'from': 0,
            'size': 200,
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
