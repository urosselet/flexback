/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
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
        let data = req.body['data'];
        let str = 'attributes.';
        
        client.update({
            'index': 'operation',
            'type': 'session',
            'id': req.body['sessionId'],
            'body': {
                'doc': {
                    'data': req.body['data']
                },
                'doc_as_upsert' : true
            }
        }, function());

        data.forEach(function(csactivity) {
            csactivity.activities.forEach(function(activity) {
                activity.label.default.cards.default.forEach(function(card) {

                    if (card.is_selected && card.cs_initiatives !== undefined) {

                        if (Object.keys(card.cs_initiatives).length > 0) {
                            Object.keys(card.cs_initiatives).forEach(function(index) {
                        
                                Object.keys(card.cs_initiatives[index]).forEach(function(attribute) {

                                    let filterKey = str.concat(index).concat('.').concat(attribute);
                                    let filterObject = {};

                                    filterObject[filterKey] = card.cs_initiatives[index][attribute];
                                    queryFilter.push({ 'match': filterObject });
                                });
                                
                            });
                        }
                    }
                })
            });
        });

        let query = {
            'nested': {
                'path': 'attributes',
                'query': {
                    'bool': {
                        'should': queryFilter
                    }
                }
            }
        };

        sails.log.info('Card filters:', query.nested.query.bool.should);

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
