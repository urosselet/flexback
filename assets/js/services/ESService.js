'use strict';

angular.module('flexcrowd.services', [])

    .service('ESService', ['Restangular', '$q',
        function (Restangular, $q) {

            return {

                /**
                 * Find all by ES type
                 */
                findAll: function(stateParams) {
                    let dfd = $q.defer();

                    if (stateParams.item === 'clusters') {

                        Restangular.all('/csplatform/aggregations').getList()
                        .then(function(res) {
                            dfd.resolve(res);
                        }, function(err) {
                            dfd.resolve(err.status);
                        });

                    } else {
                        Restangular.all('/csplatform?type=' + stateParams.item).getList()
                            .then(function(res) {
                                dfd.resolve(res);
                            }, function(err) {
                                dfd.resolve(err.status);
                            });
                    }
                    return dfd.promise;
                },

                /**
                 * Get platform by id
                 */
                findOne: function(stateParams) {
                    let dfd = $q.defer();
                    Restangular.one('/csplatform', stateParams.id).get()
                        .then(function(res) {
                            dfd.resolve(res);
                        });
                    return dfd.promise;
                },

                /**
                 * Update plateform
                 * @param  {[type]} id [description]
                 * @return {[type]}    [description]
                 */
                update: function(id, updatedObj) {
                    return Restangular.one('/csplatform', id)
                        .withHttpConfig({ 'transformRequest': angular.identity })
                        .customPUT(updatedObj, null, null, { 'Content-Type': undefined });
                },

                 /**
                 * Update plateform
                 * @param  {[type]} id [description]
                 * @return {[type]}    [description]
                 */
                create: function(updatedObj) {
                    return Restangular.one('/csplatform')
                        .withHttpConfig({ 'transformRequest': angular.identity })
                        .customPOST(updatedObj, null, null, { 'Content-Type': undefined });
                },

                /**
                 * Get all attributes
                 * @param  {[type]} id [description]
                 * @return {[type]}    [description]
                 */
                getAttributes: function() {
                    let dfd = $q.defer();
                    Restangular.one('/csplatform/getAttributes').get()
                        .then(function(res) {
                            dfd.resolve(res);
                        });
                    return dfd.promise;
                },

                /**
                 * Get formatted array for chart's display
                 * @return {[type]} [description]
                 */
                getChartsArray: function() {
                    let dfd = $q.defer();
                    Restangular.all('/csplatform/chartsArray').getList()
                        .then(function(res) {
                            dfd.resolve(res);
                        });
                    return dfd.promise;
                },

                /**
                 * Get CS Process based on it's ID
                 * @param  {[type]} stateParams [description]
                 * @return {[type]}             [description]
                 */
                getCSProcess: function(stateParams) {
                    let dfd = $q.defer();

                    if (typeof stateParams === 'undefined') {
                        Restangular.all('/csprocess').getList()
                            .then(function(res) {
                                dfd.resolve(res);
                            });
                    } else {
                        Restangular.one('/csprocess', stateParams.id).get()
                            .then(function(res) {
                                dfd.resolve(res);
                            });
                    }
                    return dfd.promise;
                },

                /**
                 * Get formatted array for chart's display
                 * @return {[type]} [description]
                 */
                getSessions: function() {
                    let dfd = $q.defer();
                    Restangular.all('/session').getList()
                        .then(function(res) {
                            dfd.resolve(res);
                        });
                    return dfd.promise;
                },

                /**
                 * CS Process update
                 * @param  {[type]} id [description]
                 * @return {[type]}    [description]
                 */
                updateCSProcess: function(id, updatedObj) {
                    return Restangular.one('/csprocess', id)
                        .customPUT(updatedObj);
                },

                /**
                 * CS Activity update
                 * @param  {[type]} id [description]
                 * @return {[type]}    [description]
                 */
                updateCSActivity: function(id, updatedObj) {
                    return Restangular.one('/csactivity', id)
                        .customPUT(updatedObj);
                },

                /**
                 * Get CS Activity based on it's ID
                 * @param  {[type]} stateParams [description]
                 * @return {[type]}             [description]
                 */
                getCSActivity: function(stateParams) {
                    let dfd = $q.defer();

                    if (typeof stateParams === 'undefined') {
                        Restangular.all('/csactivity').getList()
                            .then(function(res) {
                                dfd.resolve(res);
                            });
                    } else {
                        Restangular.one('/csactivity', stateParams.id).get()
                            .then(function(res) {
                                dfd.resolve(res);
                            });
                    }
                    return dfd.promise;
                },

                /**
                 * Import all by ES index/type
                 */
                import: function() {
                    return Restangular.all('/csplatform/import').getList();
                },

                /**
                 * Dump all by ES index/type and save it to JSON file
                 */
                export: function() {
                    return Restangular.all('/csplatform/export').getList();
                },

                /**
                 * Dump all by ES index/type and save it to JSON file
                 */
                extract: function(url) {
                    let dfd = $q.defer();
                    Restangular.one('/csplatform/extract').get({ 'url': url })
                        .then(function(res) {
                            dfd.resolve(res);
                        });
                    return dfd.promise;
                }

            }
        }

    ]);
