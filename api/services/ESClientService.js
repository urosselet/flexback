let elasticsearch = require('elasticsearch');
let client = new elasticsearch.Client({
    host: 'http://localhost:9200',
    apiVersion: '5.5',
    sniffOnStart: true,
    sniffInterval: 60000
});

module.exports = {

	process: function(option, cb) {

		client.search({
            index: 'operation',
            type: option.type,
            from : 0, 
            size : 200,
            body: {  
                query: {
                    'match_all' : {}
                }
            }
        }, function(err, results) {
        	return cb(results.hits.hits);
        });

	}

}