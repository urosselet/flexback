'use strict';

angular.module('flexcrowd.controllers')

.controller('CSActivityCtrl', ['$scope', '$state', 'csactivity', 'ESService', '$uibModal', 'toaster', '_',
    function($scope, $state, csactivity, ESService, $uibModal, toaster, _) {

        let underscore = _;

        $scope.csactivities = csactivity;

        $scope.cardsArray = [];
        $scope.activitiesArray = [];

        $scope.isSaveHidden = true;

        $scope.save = function(item) {
            $scope.isSaveHidden = true;
            ESService.updateCSActivity(item._id, item._source)
                .then(function() {
                    toaster.pop('success', 'Activity', 'Activity updated successfully');
                    $state.go('index.csactivity');
                });
        };

        $scope.setActivity = function() {
            $scope.isSaveHidden = false;
        }

        $scope.editCard = function(cardsArray, activity) {

            $scope.cardsArray = cardsArray.default;
            $scope.activity = activity;

	        $scope.modalInstance = $uibModal.open({
	            'animation': $scope.animationsEnabled,
	            'templateUrl': 'templates/_partials/card_form.html',
	            'scope': $scope,
	            'backdrop': false
	        });

        };

        $scope.saveCard = function(card) {

            $scope.cardsArray.push(card);
            $scope.modalInstance.close();

            ESService.updateCSActivity($scope.activity._id, $scope.activity._source)
                .then(function() {
                    $state.go('index.csactivity');
                });

        };

        $scope.editActivity = function(activitiesArray, activity) {

            $scope.activitiesArray = activitiesArray;
            $scope.activity = activity;

            $scope.modalInstance = $uibModal.open({
                'animation': $scope.animationsEnabled,
                'templateUrl': 'templates/_partials/activity_form.html',
                'scope': $scope,
                'backdrop': false
            });

        };

        $scope.saveActivity = function(activity) {

            function string_to_slug(str) {
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

            activity.id = string_to_slug(activity.label.default.title);
            activity.label.default['cards'] = { 'default': [] };

            $scope.activitiesArray.push(activity);
            $scope.modalInstance.close();
            
            ESService.updateCSActivity($scope.activity._id, $scope.activity._source)
                .then(function() {
                    $state.go('index.csactivity');
                });

        };

        $scope.editAttributes = function(card, activity) {

            $scope.cardAttributes = card.cs_initiatives;
            $scope.activity = activity;

            ESService.getAttributes()
                .then(function(attributes) {
                    $scope.attributes = attributes;
                }) 

            $scope.modalInstance = $uibModal.open({
                'animation': $scope.animationsEnabled,
                'templateUrl': 'templates/_partials/attributes_form.html',
                'size': 'lg',
                'scope': $scope,
                'backdrop': false
            });

        };

        $scope.saveAttributes = function(card) {};

        $scope.deleteCard = function(value3, activities, csactivity) {

            activities.forEach(function(item, index) {
                if (item.$$hashKey = value3.$$hashKey) {
                    activities.splice(index, 1)
                }
            });

            ESService.updateCSActivity(csactivity._id, csactivity._source)
                .then(function() {
                    toaster.pop('success', 'Card', 'Card deleted successfully');
                });

        };

        $scope.deleteActivity = function(activitiesArray, activity, csactivity) {

            activitiesArray.forEach(function(item, index) {
                if (item.$$hashKey = activity.$$hashKey) {
                    activitiesArray.splice(index, 1)
                }
            });

            ESService.updateCSActivity(csactivity._id, csactivity._source)
                .then(function() {
                    toaster.pop('success', 'Activity', 'Activity deleted successfully');
                });
                
        };

        $scope.closeModal = function() {
        	$scope.modalInstance.close();
        };


    }

]);