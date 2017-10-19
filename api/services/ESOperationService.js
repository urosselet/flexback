let nrc = require('node-run-cmd'),
    shell = require('shelljs'),
    fs = require('fs'),
    path = require('path'),
    esSettings = require('../../data/es_dataset/flexcrowd_settings.json'),
    client = sails.config.es.client;

module.exports = {

    /**
     * Dataset import to ES
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     */
    import: function(option, cb) {

        let dataPath = path.join(path.dirname(process.mainModule.filename), '/data/es_dataset');
        let callback = cb;

        client.indices.exists({ 'index': 'operation' })
            .then(function(res) {
                if (res) return cb(true);

                client.indices.create({ 'index': 'operation', 'body': esSettings })
                    .then(function(res) {

                        sails.log.info('Index settings: ', res);

                        nrc.run(`elasticdump --input=${dataPath}/flexcrowd_data.json --output=http://localhost:9200/operation --type=data`)
                            .then(function(code) {
                                sails.log.info('Import code: ', code[0]);
                                return callback(code[0], null);
                            });

                    }, function(err) {
                        sails.log.error(err);
                        return cb(err, null);
                    });

            }, function(err) {
                sails.log.error(err);
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
            }
        }, function(err, results) {
            return cb(err, results);
        });

    },

    /**
     * Convert ES buckets to array
     * @param  {[type]}   option [description]
     * @param  {Function} cb     [description]
     * @return {[type]}          [description]
     * @todo Refactoring
     */
    bucketsToArray: function(buckets, cb) {

        let aggs = [];

        async.auto({

            format_array: function(callback) {

                buckets.forEach(function(bucket) {

                    let aggObject = { 'cluster': bucket.key, 'platform_count': bucket.doc_count };
            
                    aggObject['attributes'] = {'process': {}, 'goal': {}, 'task': {}, 'crowd': {}};

                    Object.keys(bucket.criteria).forEach(function(attribute) {

                        let res = attribute.split(':');
                        let attributeBuckets = bucket.criteria[attribute].buckets;

                        if (res[0] !== 'doc_count') {

                            switch (res[0]) {

                                case 'process': {

                                    let tempObj = {};

                                    if (attributeBuckets.length > 0) {

                                        attributeBuckets.forEach(function(item) {
                                            tempObj[item.key] = item.doc_count;
                                        });

                                        aggObject['attributes']['process'][res[1]] = tempObj;

                                    } else {

                                        aggObject['attributes']['process'][res[1]] = null;
                                        
                                    }

                                } break;
                                
                                case 'goal': {

                                    let tempObj = {};

                                    if (attributeBuckets.length > 0) {

                                        attributeBuckets.forEach(function(item) {
                                            tempObj[item.key] = item.doc_count;
                                        });

                                        aggObject['attributes']['goal'][res[1]] = tempObj;

                                    } else {

                                        aggObject['attributes']['goal'][res[1]] = null;
                                        
                                    }

                                } break;

                                case 'task': {

                                    let tempObj = {};

                                    if (attributeBuckets.length > 0) {

                                        attributeBuckets.forEach(function(item) {
                                            tempObj[item.key] = item.doc_count;
                                        });

                                        aggObject['attributes']['task'][res[1]] = tempObj;

                                    } else {

                                        aggObject['attributes']['task'][res[1]] = null;

                                    }
                                    
                                } break;

                                case 'crowd': {

                                    let tempObj = {};

                                    if (attributeBuckets.length > 0) {

                                        attributeBuckets.forEach(function(item) {
                                            tempObj[item.key] = item.doc_count;
                                        });

                                        aggObject['attributes']['crowd'][res[1]] = tempObj;

                                    } else {

                                        aggObject['attributes']['crowd'][res[1]] = null;

                                    }
                                    
                                } break;
                            }
                        }

                    });

                    aggs.push(aggObject);

                });

                callback(null, aggs);

            }

        }, function(err, results) {
            return cb(results.format_array);
        });

    }
}