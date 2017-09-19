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
                    Restangular.all('/csplatform?type=' + stateParams.item).getList()
                        .then(function(res) {
                            dfd.resolve(res);
                        });
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
                }

            }
        }

    ]);
