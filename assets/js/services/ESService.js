'use strict';

angular.module('flexcrowd.services', [])

    .service('ESService', ['Restangular', '$q',
        function (Restangular, $q) {

            return {

                /**
                 * Find all by ES type
                 */
                findAll: function(type) {
                    return Restangular.all('/csplatform?type=' + type).getList();
                },

                /**
                 * Get platform by id
                 */
                findOne: function(id) {
                    return Restangular.one('/csplatform', id).get();
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
