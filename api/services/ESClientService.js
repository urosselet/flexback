let elasticsearch = require('elasticsearch');
let Importer = require('elastic-import');
let nrc = require('node-run-cmd');

let client = new elasticsearch.Client({
    host: 'http://localhost:9200',
    apiVersion: '5.5',
    sniffOnStart: true,
    sniffInterval: 60000
});

/**
 * Elasticsearch node client wrapper
 * @type {Object}
 */
module.exports = {

    /**
     * Query processing
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    process: function(option, cb) {

        client.search({
            'index': 'operation',
            'type': option.type,
            'from': 0,
            'size': 200,
            'body': {
                'query': {
                    'match_all': {}
                }
            }
        }, function(err, results) {

            let response = [];

            if (typeof results.hits !== 'undefined') {
                response = results.hits.hits;
            }

            return cb(response);
            
        });

    },

    /**
     * Dataset import
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    import: function(option, cb) {

        nrc.run('elastic-import ./data/liste_plateformes_crowdflower_vf.json localhost:9200 operation platform -i ignoreMe, myArray[*].ignoreMe --json')
            .then(function(platformExitCodes) {

                nrc.run('elastic-import ./data/description_categories.json localhost:9200 operation category -i ignoreMe, myArray[*].ignoreMe --json')
                    .then(function(categoryExitCodes) {
                        cb(categoryExitCodes, platformExitCodes);
                    }, function(categoryErr) {
                        console.log('Command failed to run with error: ', err);
                        cb(categoryErr);
                    });

            }, function(platformErr) {
                console.log('Command failed to run with error: ', err);
                cb(platformErr);
            });
    }

}