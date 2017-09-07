let elasticsearch = require('elasticsearch');
let nrc = require('node-run-cmd');
let defer = require('promise-defer');

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
     * Process queries
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    query: function(option) {

        return client.search(RequestService.interpolate('SEARCH', option.query));

    },

    /**
     * Query autocomplete
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    autocomplete: function(option) {

        return client.search(RequestService.interpolate('AUTOCOMPLETE', option.query));
        
    },

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
     * Dataset import to ES
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    import: function(option, cb) {

        async.auto({
            import_platform: function(callback) {
                nrc.run('elastic-import ./data/liste_plateformes_crowdflower_vf.json localhost:9200 operation platform -i ignoreMe, myArray[*].ignoreMe --json')
                    .then(function(exitCode) {
                        callback(exitCode);
                    }, function(err) {
                        callback(err);
                    });
            },
            import_category: function(callback) {
                nrc.run('elastic-import ./data/description_categories.json localhost:9200 operation category -i ignoreMe, myArray[*].ignoreMe --json')
                    .then(function(exitCode) {
                        callback(exitCode);
                    }, function(err) {
                        callback(err);
                    });
            },
            import_processing: ['import_platform', 'import_category', function(results, callback) {
                callback(results);
            }],
        }, function(err, results) {
            cb(err, results);
        });

    },

    /**
     * Dataset export to json
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    export: function(option, cb) {

        async.auto({
            export_data: function(callback) {
                nrc.run('elasticdump --input=http://localhost:9200/operation --output=./data/es_dump/flexcrowd_data.json --type=data')
                    .then(function(exitCode) {
                        callback(exitCode);
                    }, function(err) {
                        callback(err);
                    });
            },
            export_mapping: function(callback) {
                nrc.run('elasticdump --input=http://localhost:9200/operation --output=./data/es_dump/flexcrowd_mapping.json --type=mapping')
                    .then(function(exitCode) {
                        callback(exitCode);
                    }, function(err) {
                        callback(err);
                    });
            },
            export_analyzer: function(callback) {
                nrc.run('elasticdump --input=http://localhost:9200/operation --output=./data/es_dump/flexcrowd_analyzer.json --type=analyzer')
                    .then(function(exitCode) {
                        callback(exitCode);
                    }, function(err) {
                        callback(err);
                    });
            },
            export_processing: ['export_data', 'export_mapping', 'export_analyzer', function(results, callback) {
                callback(results);
            }],
        }, function(err, results) {
            cb(err, results);
        });
        
    }

}