let nrc = require('node-run-cmd'),
    shell = require('shelljs'),
    fs = require('fs'),
    path = require('path'),
    esSettings = require('../../data/settings.json'),
    client = sails.config.es.client;

module.exports = {

    /**
     * Dataset import to ES
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    import: function(option, cb) {

        let dataPath = path.join(path.dirname(process.mainModule.filename), '/data/');

        client.indices.create({ 'index': 'operation', 'body': esSettings })
            .then(function(res) {
                sails.log.info('Index settings: ', res);
                async.auto({

                    import_platform: function(callback) {
                        shell.exec(`elastic-import ${dataPath}platforms.json localhost:9200 operation platform -l error --json`, function(code) {
                            callback(null, code);
                        });
                    },

                    import_category: function(callback) {
                        shell.exec(`elastic-import ${dataPath}categories.json localhost:9200 operation category -l error --json`, function(code) {
                            callback(null, code);
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
        let dumpFolder = path.join(path.dirname(process.mainModule.filename), `/data/es_dump/${timestamp}`);

        /* check if folder exists */
        if (!fs.existsSync(dumpFolder)) {
            fs.mkdirSync(dumpFolder);
            fs.chmod(dumpFolder, 0777);
        } else{
            fs.chmod(dumpFolder, 0777);
        }

        async.auto({
            export_data: function(callback) {
                nrc.run(`elasticdump --input=http://localhost:9200/operation --output=${dumpFolder}/flexcrowd_data.json --type=data`)
                    .then(function(exitCode) {
                        callback(null, exitCode);
                    }, function(err) {
                        callback(null, err);
                    });
            },
            export_mapping: function(callback) {
                nrc.run(`elasticdump --input=http://localhost:9200/operation --output=${dumpFolder}/flexcrowd_mapping.json --type=mapping`)
                    .then(function(exitCode) {
                        callback(null, exitCode);
                    }, function(err) {
                        callback(null, err);
                    });
            },
            export_analyzer: function(callback) {
                nrc.run(`elasticdump --input=http://localhost:9200/operation --output=${dumpFolder}/flexcrowd_analyzer.json --type=analyzer`)
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