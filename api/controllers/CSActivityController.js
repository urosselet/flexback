let client = sails.config.es.client;
let slug = require('slug');

/**
 * CSActivityController
 *
 * @description :: Server-side logic for managing Csactivities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

	/**
     * Find all CS activites
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    find: function(req, res) {
        client.search({
            'index': 'operation',
            'type': 'cs_activity',
            'body': { 'query': { 'match_all': {} }, 'sort': [ { 'index': { 'order': 'asc' } } ] }
        }).then(function(results) {

            results.hits.hits.forEach(function(item, index) {

                results.hits.hits[index]._source.data.activities = _.sortBy(item._source.data.activities, 'index');

                item._source.data.activities.forEach(function(act, actIndex) {
                    item._source.data.activities[actIndex].label.default.cards.default = _.sortBy(act.label.default.cards.default, 'index');
                });
                
            });

            return res.json(results.hits.hits);
        });
    },

    /**
     * Update a CS activity based on its id
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    update: function(req, res) {
        client.update({ index: 'operation', type: 'cs_activity', id: req.param('id'), body: { doc: req.body } })
            .then(function(result) {

                client.get({ index: 'operation', type: 'cs_activity', id: req.param('id') })
                    .then(function(csactivity) {

                        csactivity = {
                            'id': csactivity._id,
                            'activity_name': csactivity._source.activity_name,
                            'icon': csactivity._source.icon,
                            'label': csactivity._source.data.label,
                            'activities': csactivity._source.data.activities
                        };

                        return res.json(csactivity._source);
                    });

            });
    },

    /**
     * Get CS Activities wizard array
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    wizard: function(req, res) {

        client.search({
            'index': 'operation',
            'type': 'cs_activity',
            'body': { 'query': { 'match_all': {} }, 'sort': [ { 'index': { 'order': 'asc' } } ] }
        }).then(function(results) {
            let csactivityArray = [];
            results.hits.hits.forEach(function(csactivity) {
                let csactivityObj = {
                    'id': csactivity._id,
                    'index': csactivity.index,
                    'activity_name': csactivity._source.activity_name,
                    'icon': csactivity._source.icon,
                    'label': csactivity._source.data.label,
                    'activities': csactivity._source.data.activities
                };

                csactivityObj.activities = _.sortBy(csactivity._source.data.activities, 'index');

                csactivityObj.activities.forEach(function(act, index) {
                    csactivityObj.activities[index].label.default.cards.default = _.sortBy(act.label.default.cards.default, 'index');
                });

                csactivityArray.push(csactivityObj);

            });

            ESOperationService.getSessionData({ 'sessionId': req.param('id') }, function(session) {
                return res.json({ 'activities': csactivityArray, 'sessionData': session });
            });

        });
    },

    /**
     * Replace Image URL
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    replaceImgUrl: function(req, res) {

        client.search({
            'index': 'operation',
            'type': 'platform',
            'from': 0,
            'size': 200,
            'body': { 'query': { 'match_all': {} } }
        }).then(function(plaforms) {
            
            plaforms.hits.hits.forEach(function(item) {

                let imgURL = item._source.platform_img_url;

                if (imgURL) {
                    imgURL = imgURL.replace('http://flexcrowd.org:8082/upload/', '');
                    imgURL = imgURL.replace('http://localhost:1338/upload/', '');

                    client.update({
                        'index': 'operation',
                        'type': 'platform',
                        'id': item._id,
                        'body': {
                            'doc': {
                                'platform_img_url': imgURL
                            }
                        }
                    }, function() {
                        return res.ok();
                    });
                    
                }
            });

        });
    },

    /**
     * Define an id for all card based card title
     * @param {[type]} req [description]
     * @param {[type]} res [description]
     */
    setCardsId: function(req, res) {

        client.search({
            'index': 'operation',
            'type': 'cs_activity',
            'body': { 'query': { 'match_all': {} }, 'sort': [ { 'index': { 'order': 'asc' } } ] }
        }).then(function(results) {
            
            results.hits.hits.forEach(function(item) {
                
                item._source.data.activities.forEach(function(activity) {

                    let index = 0;

                    activity.label.default.cards.default.forEach(function(card) {
                        index = index + 1;
                        card['id'] = slug(card.title, { 'lower': true, replacement: '_' });
                        card['index'] = index;
                    });

                });

                client.update({ index: 'operation', type: 'cs_activity', 'id': item._id, body: { 'doc': item._source } })
                    .then(function(response) {
                        sails.log.info('Activity ' + item._id , response.result);
                    });
                    
            });

            return res.ok();

        });

    },
	
};
