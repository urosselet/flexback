/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const { Flexcrowd } = require('flx-process');
const flexClient = Flexcrowd.init({ 'file': 'flow.yml' });

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
    }

};