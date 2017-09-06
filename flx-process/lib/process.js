'use strict';

/**
 * Modules loading
 */
var YAML = require('yamljs');
var path = require('path');
var StateMachine = require('javascript-state-machine');

/**
 * Process workflow Module
 * @param  {Object} ) {    var        decisionTree [description]
 * @return {[type]}   [description]
 */
const Flexcrowd = (function() {

	let decisionTree = {};
    let config = {};
    let fsm = {};

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

           this.fsm = new StateMachine({
                init: 'level_1',
                transitions: [
                    { name: 'intent_1', from: 'level_1', to: 'level_2' },
                    { name: 'intent_2', from: 'level_2', to: 'level_3' },
                ]
            });

           return this;

        },

        assert: function(query, cb) {

            sails.log.info('YAML Tree :: ', this.decisionTree.intent);

            let intent = _.pluck(this.decisionTree.intent['level_1'], query)[0];

            sails.log.info('Found intent :: ', intent);

            // this.fsm.assess1();

            // sails.log.info('State :: ', this.fsm.state);

        	return cb(intent);

        },

    };

})();

module.exports = Flexcrowd;