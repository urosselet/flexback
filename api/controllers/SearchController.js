/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const { Flexcrowd } = require('flx-process');
const flexClient = Flexcrowd.init({ 'file': 'flow.yml' });

module.exports = {

    find: function(req, res) {

        let query = req.param('query');

        if (req.param('status') === 'true') {

            flexClient.sessionStart();

            ESClientService.query({ 'query': query })
                .then(function(results) {

                    flexClient.assert(results.hits.hits[0]._source.category, query)
                        .then(function(result) {
                            return res.json([{'q': result.category.question.q}]);
                        });

                });

        } else if (req.param('status') === 'false') {

            flexClient.proceed(req.param('query'))
                .then(function(result) {
                    return res.json(result);
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