let nrc = require('node-run-cmd'),
    fs = require('fs'),
    path = require('path'),
    esSettings = require('../../data/es_settings.json'),
    client = sails.config.es.client;

module.exports = {

    /**
     * Dataset import to ES
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    import: function(option, cb) {

        client.indices.create({ 'index': 'operation', 'body': esSettings })
            .then(function(res) {
                sails.log.info('Index settings: ', res);
                async.auto({

                    import_platform: function(callback) {
                        nrc.run('elastic-import ./data/liste_plateformes_crowdflower_vf.json localhost:9200 operation platform -i ignoreMe, myArray[*].ignoreMe --json')
                            .then(function(exitCode) {
                                sails.log.info('Platform dataset import: ', exitCode);
                                callback(null, exitCode);
                            }, function(err) {
                                sails.log.info('Platform dataset import error: ', err);
                                callback(null, err);
                            });
                    },

                    import_category: function(callback) {
                        nrc.run('elastic-import ./data/description_categories.json localhost:9200 operation category -i ignoreMe, myArray[*].ignoreMe --json')
                            .then(function(exitCode) {
                                sails.log.info('Category dataset import: ', exitCode);
                                callback(null, exitCode);
                            }, function(err) {
                                sails.log.info('Category dataset import error: ', err);
                                callback(null, err);
                            });
                    }
                    
                }, function(err, results) {
                    return cb(err, results);
                });

            }, function(err) {
                return cb(err, null);
            });

    },

    /**
     * Dataset export to json
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    export: function(option, cb) {

        let timestamp = Date.now();
        let dumpFoler = path.join(path.dirname(process.mainModule.filename), `/data/es_dump/${timestamp}`);

        /* check if folder exists */
        if (!fs.existsSync(dumpFoler)) {
            fs.mkdirSync(dumpFoler);
            fs.chmod(dumpFoler, 0777);
        } else{
            fs.chmod(dumpFoler, 0777);
        }

        async.auto({
            export_data: function(callback) {
                nrc.run(`elasticdump --input=http://localhost:9200/operation --output=${dumpFoler}/flexcrowd_data.json --type=data`)
                    .then(function(exitCode) {
                        callback(null, exitCode);
                    }, function(err) {
                        callback(null, err);
                    });
            },
            export_mapping: function(callback) {
                nrc.run(`elasticdump --input=http://localhost:9200/operation --output=${dumpFoler}/flexcrowd_mapping.json --type=mapping`)
                    .then(function(exitCode) {
                        callback(null, exitCode);
                    }, function(err) {
                        callback(null, err);
                    });
            },
            export_analyzer: function(callback) {
                nrc.run(`elasticdump --input=http://localhost:9200/operation --output=${dumpFoler}/flexcrowd_analyzer.json --type=analyzer`)
                    .then(function(exitCode) {
                        callback(null, exitCode);
                    }, function(err) {
                        callback(null, err);
                    });
            },
            export_processing: ['export_data', 'export_mapping', 'export_analyzer', function(results, callback) {
                callback(null, results);
            }],
        }, function(err, results) {
            cb(err, results);
        });

    }

}