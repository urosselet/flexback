let client = sails.config.es.client;

/**
 * CSProcessController
 *
 * @description :: Server-side logic for managing Csprocesses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

	/**
	 * Find all CS processes
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	find: function(req, res) {
        client.search({ 
            'index': 'operation', 
            'type': 'cs_process', 
            'body': { 'query': { 'match_all': {} } }
        }).then(function(results) {

        	let csprocessArray = [];

        	results.hits.hits.forEach(function(csprocess) {

        		if (typeof csprocess._source.data.dimensions !== 'undefined') {

        			let csprocessObj = {
	        			'id': csprocess._id,
	        			'process_name': csprocess._source.process_name,
	        			'label': csprocess._source.data.label,
	        			'dimensions': csprocess._source.data.dimensions[0]
	        		}

	        		csprocessArray.push(csprocessObj);
        		}

        	});
            
            return res.json(csprocessArray);

        });
	},

	/**
	 * Find one CS Process based on it's ID
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	findOne: function(req, res) {
		client.get({ index: 'operation', type: 'cs_process', id: req.param('id') })
            .then(function(csprocesses) {

            	let csprocessArray = [];

            	csprocesses.forEach(function(csprocess) {
            		let csprocessObj = {
            			'id': csprocess._id,
            			'process_name': csprocess._source.data.process_name,
            			'labels': csprocess._source.data.label,
            			'dimension': csprocess._source.data.dimensions[0]
            		}
            		csprocessArray.push(csprocessArray);
            	});
                
                return res.json(csprocessArray);

            });
	}

};

