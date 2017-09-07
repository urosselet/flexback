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

        if (req.param('status') === 'true') {

            ESClientService.query({ 'query': req.param('query') })
                .then(function(results) {
                    flexClient.assert(results.hits.hits[0]._source.category)
                        .then(function(result) {
                            return res.json(result.category.questions);
                        });

                });

        } else if (req.param('status') === 'false') {

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