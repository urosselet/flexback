let elasticsearch = require('elasticsearch');

/****************************************************************************
 *                                                                          *
 * Elasticsearch client global module                                       *
 *                                                                          *
 ****************************************************************************/
module.exports.es = {

    /**
     * Elasticsearch default settings
     * @type {Object}
     */
    settings: {
        'host': 'http://localhost:9200',
        'apiVersion': '5.5',
        'sniffOnStart': true,
        'sniffInterval': 60000
    },

    /****************************************************************************
     *                                                                          *
     * Elasticsearch client instantiation with default settings                 *
     *                                                                          *
     ****************************************************************************/
    client: (function() {
        return new elasticsearch.Client(this.settings);
    })()

}