'use strict';

angular.module('flexcrowd.services', [])

    .service('ESService', ['Restangular', '$q',
        function (Restangular, $q) {

            return {

                /**
                 * Find all by ES type
                 */
                findAll: function (type) {
                    let defer = $q.defer();
                    Restangular.all('/csplatform?type=' + type).getList()
                        .then(function (res) {
                            defer.resolve(res);
                        })
                    return defer.promise;
                },

                /**
                 * Import all by ES index/type
                 */
                import: function () {
                    let defer = $q.defer();
                    Restangular.all('/csplatform/import').getList()
                        .then(function (res) {
                            defer.resolve(res);
                        })
                    return defer.promise;
                },

                /**
                 * Dump all by ES index/type and save it to JSON file
                 */
                dump: function () {
                    let defer = $q.defer();
                    Restangular.all('/csplatform/dump').getList()
                        .then(function (res) {
                            defer.resolve(res);
                        })
                    return defer.promise;
                }

            }
        }

    ]);
