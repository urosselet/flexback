'use strict';

angular.module('flexcrowd.controllers')

.controller('CSActivityCtrl', ['$scope', '$state', 'csactivity', 'ESService', '$uibModal', 'toaster', '$ngConfirm', '$filter',
    function($scope, $state, csactivity, ESService, $uibModal, toaster, $ngConfirm, $filter) {

        $scope.csactivities = csactivity;

        $scope.cardsArray = [];
        $scope.activitiesArray = [];

        $scope.isSaveHidden = true;

        $scope.statuses = [
            {
                val: true,
                text: 'Yes'
            }, 
            {
                val: false,
                text: 'No'
            }
        ];

        /**
         * Add ToDo to list
         * @param {[type]} cardAttributes [description]
         */
        $scope.addToDo = function(cardAttributes) {
            if (angular.isUndefined(cardAttributes['todos'])) {
                cardAttributes['todos'] = [];
            }
            cardAttributes['todos'].push({ 'description': '' });
        };

        /**
         * Remove ToDo from list
         * @param {[type]} cardAttributes [description]
         */
        $scope.removeToDo = function(todo, todos) {
            let index = todos.indexOf(todo);
            todos.splice(index, 1);
        };

        /**
         * Show activity status of having multiple choices
         * @param  {[type]} selectedValue [description]
         * @return {[type]}               [description]
         */
        $scope.showStatus = function(selectedValue) {
            var selected = [];
            if (selectedValue.is_multiple_choice) {
                selected = $filter('filter') ($scope.statuses, { val: selectedValue.is_multiple_choice });
            }
            return selected.length ? selected[0].text : 'No';
        };

        /**
         * Save activity
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        $scope.save = function(item) {
            $scope.isSaveHidden = true;
            ESService.updateCSActivity(item._id, item._source)
                .then(function() {
                    $state.go('index.csactivity');
                    toaster.pop('success', 'Activity', 'Activity updated successfully');
                });
        };

        /**
         * Diplay save button if activity object changer
         */
        $scope.setActivity = function() {
            $scope.isSaveHidden = false;
        }

        /**
         * Open card modal for update
         * @param  {[type]} cardsArray [description]
         * @param  {[type]} activity   [description]
         * @return {[type]}            [description]
         */
        $scope.createCard = function(cardsArray, activity) {

            $ngConfirm({
                columnClass: 'large',
                title: 'Create new card',
                contentUrl: 'templates/_dialogs/card_form.html',
                scope: $scope,
                buttons: {
                    create: {
                        text: 'Create card',
                        btnClass: 'btn-green',
                        action: function(scope) {

                            $scope.activity = activity;
                            $scope.cardsArray = cardsArray.default;
                            $scope.cardsArray.push(scope.card);

                            ESService.updateCSActivity($scope.activity._id, $scope.activity._source)
                                .then(function() {
                                    $state.go('index.csactivity', {}, { 'reload': true });
                                    toaster.pop('success', 'Card creation', 'Card created successfully');
                                });
                        }
                    },
                    close: function() {}
                }
            });

        };

        $scope.editActivity = function(activitiesArray, activity) {

            $scope.activitiesArray = activitiesArray;
            $scope.activity = activity;

            $scope.modalInstance = $uibModal.open({
                'animation': $scope.animationsEnabled,
                'templateUrl': 'templates/_dialogs/activity_form.html',
                'scope': $scope,
                'backdrop': false
            });

        };

        $scope.saveActivity = function(activity) {

            function stringToSlug(str) {
                str = str.replace(/^\s+|\s+$/g, '');
                str = str.toLowerCase();

                let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
                let to = "aaaaeeeeiiiioooouuuunc------";

                for (var i = 0, l = from.length; i < l; i++) {
                    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                }

                str = str.replace(/[^a-z0-9 -]/g, '')
                    .replace(/\s+/g, '_')
                    .replace(/-+/g, '_');

                return str;
            }

            activity.id = stringToSlug(activity.label.default.title);
            activity.label.default['cards'] = { 'default': [] };

            $scope.activitiesArray.push(activity);
            $scope.modalInstance.close();
            
            ESService.updateCSActivity($scope.activity._id, $scope.activity._source)
                .then(function() {
                    $state.go('index.csactivity', {}, { 'reload': true });
                    toaster.pop('success', 'Activity creation', 'Activity created successfully');
                });

        };

        $scope.editAttributes = function(card, activity) {

            $scope.cardAttributes = card;
            $scope.activity = activity;

            ESService.getAttributes()
                .then(function(attributes) {
                    $scope.attributes = attributes;
                });

            $scope.modalInstance = $uibModal.open({
                'animation': $scope.animationsEnabled,
                'templateUrl': 'templates/_dialogs/attributes_form.html',
                'size': 'lg',
                'scope': $scope,
                'backdrop': false
            });

        };

        /**
         * Save card attributes
         * @param  {[type]} cardAttributes [description]
         * @return {[type]}                [description]
         */
        $scope.saveAttributes = function(cardAttributes) {

            if (angular.isUndefined(cardAttributes.cs_initiatives)) { cardAttributes.cs_initiatives = {} };
            
            Object.keys(cardAttributes.cs_initiatives).map(function(objectKey, index) {
                Object.keys(cardAttributes.cs_initiatives[objectKey]).map(function(obj) {
                    if (cardAttributes.cs_initiatives[objectKey][obj] === '') {
                        delete cardAttributes.cs_initiatives[objectKey][obj];
                    }
                });
                if (Object.keys(cardAttributes.cs_initiatives[objectKey]).length === 0 ) {
                    delete cardAttributes.cs_initiatives[objectKey];
                }
            });

            ESService.updateCSActivity($scope.activity._id, $scope.activity._source)
                .then(function() {
                    $state.go('index.csactivity', {}, { 'reload': true });
                    toaster.pop('success', 'Card attributes', 'Attributes saved successfully');
                    $scope.closeModal();
                });
        };

        /**
         * Delete a card from an activity
         * @param  {[type]} card       [description]
         * @param  {[type]} cardsArray [description]
         * @param  {[type]} csactivity [description]
         * @return {[type]}            [description]
         */
        $scope.deleteCard = function(card, cardsArray, csactivity) {

            $ngConfirm({
                title: 'Card deletion',
                content: 'Please confirm the deletion of the card ' + card.title,
                scope: $scope,
                type: 'red',
                typeAnimated: true,
                buttons: {
                    Yes: {
                        text: 'Yes',
                        btnClass: 'btn-red',
                        action: function() {

                            cardsArray.forEach(function(item, index) {
                                if (item.$$hashKey === card.$$hashKey) {
                                    $scope.$apply(function() { cardsArray.splice(index, 1); });
                                }
                            });

                            ESService.updateCSActivity(csactivity._id, csactivity._source)
                                .then(function() {
                                    toaster.pop('success', 'Card', 'Card deleted successfully');
                                });
                        }
                    },
                    close: function() {}
                }
            });

        };

        $scope.deleteActivity = function(activitiesArray, activity, csactivity) {

            $ngConfirm({
                title: 'Activity deletion',
                content: 'Please confirm the deletion of activity ' + activity.label.default.title + '<br><br> All cards will also be deleted !',
                scope: $scope,
                type: 'red',
                typeAnimated: true,
                buttons: {
                    Yes: {
                        text: 'Yes',
                        btnClass: 'btn-red',
                        action: function(scope, button) {
                            activitiesArray.forEach(function(item, index) {
                                if (item.$$hashKey = activity.$$hashKey) {
                                    activitiesArray.splice(index, 1)
                                }
                            });

                            ESService.updateCSActivity(csactivity._id, csactivity._source)
                                .then(function() {
                                    toaster.pop('success', 'Activity', 'Activity deleted successfully');
                                });
                        }
                    },
                    close: function(scope, button) {}
                }
            });
                
        };

        $scope.closeModal = function() {
        	$scope.modalInstance.close();
        };

    }

]);