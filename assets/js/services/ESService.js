'use strict';

angular.module('flexcrowd.services', [])

    .service('ESService', ['Restangular', '$q',
        function (Restangular, $q) {

            return {

                /**
                 * Find all platforms
                 */
                findAll: function (type) {
                    var defer = $q.defer();

                    Restangular.all('/csplatform?type=' + type).getList()
                        .then(function (res) {
                            defer.resolve(res);
                        })

                    return defer.promise;
                }

            }
        }

    ]);
