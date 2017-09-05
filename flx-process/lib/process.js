'use strict';

/**
 * Modules loading
 */
var YAML = require('yamljs');
var path = require('path');
var StateMachine = require('javascript-state-machine');

/**
 * Process workflow
 * @param  {Object} ) {    var        decisionTree [description]
 * @return {[type]}   [description]
 */
const Flexcrowd = (function() {

	let decisionTree = {};
    let config = {};

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
        	// console.log(this.decisionTree)
            //console.log('Process function : ', query);
            console.log(query)
            console.log(this.decisionTree.intent[query])

        	//return cb()
        },

        getState: function() {

            let fsm = new StateMachine({
                init: 'intent',
                transitions: [
                    { name: 'goal', from: 'intent', to: 'assess' },
                    { name: 'task', from: 'assess', to: 'perfom' },
                    { name: 'crowd', from: 'perfom', to: 'reward' },
                ]
            });

            return fsm;

        }

    };

})();

module.exports = Flexcrowd;