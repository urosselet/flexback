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

    }

}