'use strict';

angular.module('bahmni.clinical')
    .service('orderNotesService', ['$http', '$q', function ($http, $q) {
        this.getReasonsToSelectConceptSet = function () {
            var def = $q.defer();
            $http.get(Bahmni.Common.Constants.globalPropertyUrl, {
                method: "GET",
                params: {
                    property: 'emr.reasonsForLabtests'
                },
                withCredentials: true,
                headers: {
                    Accept: 'text/plain'
                }
            }).success(function (conceptName) {
                def.resolve(conceptName);
            });

            return def.promise;
        };

        this.getReasonConcepts = function (name) {
            return $http.get(Bahmni.Common.Constants.conceptUrl, {
                method: "GET",
                params: {
                    q: name,
                    v: 'custom:(uuid,name,answers:(name:(name)))'
                },
                withCredentials: true
            });
        };
    }]);
