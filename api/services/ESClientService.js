let client = sails.config.es.client;

/**
 * Elasticsearch node client wrapper
 * @type {Object}
 */
module.exports = {

    /**
     * Process queries
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    query: function(option) {

        return client.search(RequestService.interpolate('SEARCH', '{{query}}', option.query));

    },

    /**
     * Query autocomplete
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    autocomplete: function(option) {

        return client.search(RequestService.interpolate('AUTOCOMPLETE', '{{query}}', option.query));
        
    },

    /**
     * Query processing
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    process: function(option) {

        return client.search(RequestService.interpolate('PROCESS', '{{type}}', option.type));

    },

    /**
     * Get all attributes
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    getAllAttributes: function(option, cb) {

        async.auto({

            process: function(callback) {
                client.search({ 
                    'index': 'operation', 
                    'type': 'process', 
                    'body': { 'query': { 'match_all': {} } }
                }).then(function(response) {
                    callback(null, response);
                });
            },

            goal: function(callback) {
                client.search({ 
                    'index': 'operation', 
                    'type': 'goal', 
                    'body': { 'query': { 'match_all': {} } }
                }).then(function(response) {
                    callback(null, response);
                });
            },

            task: function(callback) {
                client.search({ 
                    'index': 'operation', 
                    'type': 'task', 
                    'body': { 'query': { 'match_all': {} } }
                }).then(function(response) {
                    callback(null, response);
                });
            },

            crowd: function(callback) {
                client.search({ 
                    'index': 'operation', 
                    'type': 'crowd', 
                    'body': { 'query': { 'match_all': {} } }
                }).then(function(response) {
                    callback(null, response);
                });
            },

            to_array: ['process', 'goal', 'task', 'crowd', function(callback, results) {
                let attributes = {
                    process: results.process.hits.hits,
                    goal: results.goal.hits.hits,
                    task: results.task.hits.hits,
                    crowd: results.crowd.hits.hits
                };
                callback(null, attributes);
            }],

        }, function(err, results) {
            return cb(results.to_array);
        });
    }

}