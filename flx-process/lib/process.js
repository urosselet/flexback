'use strict';

/**
 * Modules loading
 */
let YAML = require('yamljs');
let path = require('path');
let StateMachine = require('javascript-state-machine');
let defer = require('promise-defer');

/**
 * Process workflow Module
 * @param  {Object} ) { var decisionTree [description]
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

           return this;

        },

        sessionStart: function() {

            this.fsm = new StateMachine({
                init: 'level_1',
                transitions: [
                    { name: 'flow_1', from: 'level_1', to: 'level_2' },
                    { name: 'flow_2', from: 'level_2', to: 'level_3' },
                ],
                methods: {
                    onFlow1: function() { 
                        // console.log('flow_1')   
                    },
                    onFlow2: function() { 
                        // console.log('flow_2')     
                    }
                }
            });
        },

        /**
         * First query assertion to determine the category
         * @param  {[type]}   cat [description]
         * @param  {Function} cb  [description]
         * @return {[type]}       [description]
         */
        assert: function(cat) {

            let deferred = defer();

            sails.log.info('Decision Tree :: ', this.decisionTree.intent['level_1']);

            let intent = _.find(this.decisionTree.intent['level_1'], function(foundCat) {
                return foundCat.category.id === cat;
            })

            sails.log.info('Found intent :: ', intent);

            // this.fsm.flow1();

            // sails.log.info('State :: ', this.fsm.state);
            deferred.resolve(intent);

            return deferred.promise;

        },

        flow: function(q, cb) {
            this.fsm.flow2();
            console.log(this.fsm.state)
        }

    };

})();

module.exports = Flexcrowd;