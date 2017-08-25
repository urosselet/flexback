'use strict';

angular.module('flexcrowd.directives', [])

.directive('fileUpload', ['$timeout',
    function($timeout) {
        return {
            scope: true,
            link: function($scope, el, attrs) {
                el.bind('change', function(event) {
                    $scope.$emit('fileSelected', { file: event.target.files[0] });
                    $scope.$apply();
                });
            }
        }
    }

])

.directive('listSlideToggle', ['$timeout',
    function($timeout) {
        return {
            scope: true,
            link: function($scope, el, attrs) {
                el.bind('click', function() {

                    jQuery(this)
                        .parents()
                        .find('li.current-view')
                        .removeClass('current-view')
                        .find('.screen-detail')
                        .slideToggle();

                    jQuery(this)
                        .toggleClass('current-view')
                        .find('.screen-detail')
                        .slideToggle();
                });
            }
        }
    }

])

.directive('formWizard', ['$timeout',
    function($timeout) {

        return {
            link: function($scope, el, attrs) {

                //jQuery('.nav-tabs > li a[title]').tooltip();

                function nextTab(elem) {
                    jQuery(elem)
                        .next()
                        .find('a[data-toggle="tab"]')
                        .click();
                }

                function prevTab(elem) {
                    jQuery(elem)
                        .prev()
                        .find('a[data-toggle="tab"]')
                        .click();
                }

                //Wizard
                jQuery('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
                    var $target = jQuery(e.target);
                    if ($target.parent().hasClass('disabled')) {
                        return false;
                    }
                });

                jQuery('.next-step').click(function(e) {
                    var $active = jQuery('.wizard .nav-tabs li.active');
                    $active.next().removeClass('disabled');
                    nextTab($active);

                });

                jQuery('.prev-step').click(function(e) {
                    var $active = jQuery('.wizard .nav-tabs li.active');
                    prevTab($active);
                });


            }

        }
    }

]);
