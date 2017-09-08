'use strict';

/**
 * Modules loading
 */
let StateMachine = require('javascript-state-machine');
let StateMachineHistory = require('javascript-state-machine/lib/history');
let YAML = require('yamljs');
let path = require('path');
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
    let nodeStructure = null;
    let queries = null;
    let level = null;
    let category = null;
    

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
            this.nodeStructure = { 'text': { 'name': null }, 'children': [] }
            this.queries = [];
            this.level = 0;
            this.category = '';

            return this;

        },

        sessionStart: function() {

            this.fsm = new StateMachine({
                init: 'level_0',
                transitions: [
                    { name: 'proceed', from: 'level_0', to: 'level_1' },
                    { name: 'proceed', from: 'level_1', to: 'level_2' },
                    { name: 'proceed', from: 'level_2', to: 'level_3' },
                    { name: 'proceed', from: 'level_3', to: 'level_4' },
                    { name: 'proceed', from: 'level_4', to: 'level_5' }
                ]
            });

        },

        /**
         * First query assertion to determine the category
         * @param  {[type]}   cat [description]
         * @param  {Function} cb  [description]
         * @return {[type]}       [description]
         */
        assert: function(cat, query) {

            let deferred = defer();
            let that = this;

            this.queries.push(query);

            sails.log.info('Decision Tree :: ', this.decisionTree.intent['level_1']);

            let intent = _.find(this.decisionTree.intent['level_1'], function(foundCat) {
                that.category = cat;
                return foundCat.category.id === cat;
            });

            this.nodeStructure.text.name = cat;

            sails.log.info('Found intent :: ', intent);

            this.fsm.proceed();

            sails.log.info('State :: ', this.fsm.state);

            deferred.resolve(intent);

            return deferred.promise;

        },

        proceed: function(query) {

            let deferred = defer();
            let node = { 'text': {'name': query }};
            let level = parseInt(this.fsm.state.split('_')[1]);
            let that = this;

            this.queries.push(query);

            sails.log.info('State :: ', this.fsm.state);

            this.fsm.proceed();

            let intent = _.find(this.decisionTree.intent['level_1'], function(foundCat) {
                
                if (foundCat.category.id === that.category) {
                    return foundCat.category[that.fsm.state]
                }

            });

            deferred.resolve(intent.category[this.fsm.state]);

            sails.log.info('State :: ', this.queries);
            sails.log.info('State :: ', this.nodeStructure);

            return deferred.promise;
        }

    };

})();

module.exports = Flexcrowd;