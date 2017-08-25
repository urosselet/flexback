'use strict';

angular.module('flexcrowd.services', [])

    .service('ESService', ['Restangular', '$q',
        function (Restangular, $q) {

            return {

                /**
                 * Find all platforms
                 */
                findAll: function () {
                    var defer = $q.defer();

                    Restangular.all('/csplatform').getList()
                        .then(function (res) {
                            defer.resolve(res);
                        })

                    return defer.promise;
                }

            }
        }

    ]);
