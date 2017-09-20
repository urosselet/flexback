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

        if (req.param('status') === 'true') {

            flexClient.sessionStart();

            /*ESClientService.query({ 'type': 'SEARCH', 'query': query })
                .then(function(results) {

                    flexClient.assert(results.hits.hits[0]._source.category, query)
                        .then(function(result) {
                            //return res.json(result);
                        });

                });*/

            ESClientService.query({ 'type': 'PLATFORM', 'query': query })
                .then(function(results) {

                    let maxScore = results.hits.max_score;
                    let mediumHits = [];
                    let highHits = [];

                    results.hits.hits.forEach(function(ele) {
                        ele._source['id'] = ele._id;
                        if (ele._score > (maxScore/2)) {
                            highHits.push(ele._source);
                        } else if (ele._score < (maxScore/2)) {
                            mediumHits.push(ele._source);
                        }
                    });

                    return res.json({'results': { 'medium_hits': mediumHits, 'high_hits': highHits }});
                });

        } else if (req.param('status') === 'false') {

            /* flexClient.proceed(req.param('query'))
                .then(function(result) {
                    return res.json(result);
                });*/

            ESClientService.query({ 'type': 'PLATFORM', 'query': query })
                .then(function(results) {

                    let maxScore = results.hits.max_score;
                    let mediumHits = [];
                    let highHits = [];

                    results.hits.hits.forEach(function(ele) {
                        ele._source['id'] = ele._id;
                        if (ele._score > (maxScore/2)) {
                            highHits.push(ele._source);
                        } else if (ele._score < (maxScore/2)) {
                            mediumHits.push(ele._source);
                        }
                    });

                    return res.json({'results': { 'medium_hits': mediumHits, 'high_hits': highHits }});
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
    }

};