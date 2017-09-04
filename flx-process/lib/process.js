'use strict';

/**
 * Modules loading
 */
let YAML = require('yamljs');
let path = require('path');

/**
 * Global variable
 * @type {Object}
 */
let config = {};

const Flexcrowd = (function() {

	var decisionTree = {};

	const validate = function (opts) {
		 if (!opts.file) {
	        throw new Error('Could not find file!');
	    }
	    return opts;
	};

    return {
    	/**
    	 * Module initialisation
    	 * @param  {[type]} opts [description]
    	 * @return {[type]}      [description]
    	 */
        init: function(opts) {

           const { file } = this.config = Object.freeze(validate(opts));

           this.decisionTree = YAML.load(path.join(__dirname, '..', 'yaml_files', opts.file));

           return this;

        },

        assert: function(query, cb) {
        	console.log(this.decisionTree)
        	return cb(query)
        }

    };

})();

module.exports = Flexcrowd;