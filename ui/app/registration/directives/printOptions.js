'use strict';

angular.module('bahmni.registration')
    .directive('printOptions', ['$rootScope', 'registrationCardPrinter', 'spinner', 'appService', '$filter',
        function ($rootScope, registrationCardPrinter, spinner, appService, $filter) {
            var controller = function ($scope) {
                $scope.printOptions = appService.getAppDescriptor().getConfigValue("printOptions");
                $scope.defaultPrint = $scope.printOptions && $scope.printOptions[0];

                var mapRegistrationObservations = function () {
                    var obs = {};
                    $scope.observations = $scope.observations || [];
                    var getValue = function (observation) {
                        obs[observation.concept.name] = obs[observation.concept.name] || [];
                        observation.value && obs[observation.concept.name].push(observation.value);
                        observation.groupMembers.forEach(getValue);
                    };

                    $scope.observations.forEach(getValue);
                    return obs;
                };
                var constructRelationships = function () {
                    var relationships = [];
                    var relationshipTypes = $scope.relationshipTypes;
                    _.each($scope.patient.relationships, function (relationship) {
                        var rel = {};
                        var relationshipType = _.find(relationshipTypes, { uuid: relationship.relationshipType.uuid });
                        if (!relationship.personA) {
                            return;
                        }
                        if (relationship.personA.uuid === $scope.patient.uuid) {
                            rel = { "person": relationship.personB.display, "relationshipType": relationshipType.aIsToB };
                        } else {
                            rel = { "person": relationship.personA.display, "relationshipType": relationshipType.bIsToA };
                        }
                        relationships.push(rel);
                    });

                    return relationships;
                }
                $scope.print = function (option) {
                    $scope.patient.relationshipsToPrint = constructRelationships();
                    return registrationCardPrinter.print(option.templateUrl, $scope.patient, mapRegistrationObservations(), $scope.encounterDateTime);
                };

                $scope.buttonText = function (option, type) {
                    var printHtml = "";
                    var optionValue = option && $filter('titleTranslate')(option);
                    if (type) {
                        printHtml = '<i class="fa fa-print"></i>';
                    }
                    return '<span>' + optionValue + '</span>' + printHtml;
                };
            };

            return {
                restrict: 'A',
                templateUrl: 'views/printOptions.html',
                controller: controller
            };
        }]);
