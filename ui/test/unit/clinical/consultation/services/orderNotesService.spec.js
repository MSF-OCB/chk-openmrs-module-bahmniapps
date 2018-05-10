'use strict';

describe('orderNotesService', function () {

    var http;
    var q;
    beforeEach(module('bahmni.clinical'));

    beforeEach(module(function () {
        http = jasmine.createSpyObj('http', ['get']);
    }));

    beforeEach(module(function ($provide) {
        $provide.value('$http', http);
        $provide.value('$q', Q);
    }));

    beforeEach(inject(['orderNotesService', function (orderNotesService) {
        this.orderNotesService = orderNotesService;
    }]));

    it('should call http service to return reasons concept set name', function () {
        http.get.and.callFake(function () {
            return {
                success: function(fn) {
                    return fn("Raisons du test de laboratoire");
                }
            };
        });
        var httpPromise = this.orderNotesService.getReasonsToSelectConceptSet().then(function (result) {
            expect($http.get).toHaveBeenCalledWith([Bahmni.Common.Constants.globalPropertyUrl,
                {
                    method: "GET",
                    params: {
                        property: 'emr.reasonsForLabtests'
                    },
                    withCredentials: true,
                    headers: {
                        Accept: 'text/plain'
                    }
                }]);
            done();
        });
    });

    it('should call http service to return reasons concepts', function () {
        var data = {
            name:
                {
                    name: 'first concept'
                }
        };
        http.get.and.callFake(function () {
            return specUtil.respondWithPromise(Q, { data: data });
        });
        var name = 'Raisons du test de laboratoire';
        var httpPromise = this.orderNotesService.getReasonConcepts(name).then(function () {
            expect($http.get).toHaveBeenCalledWith([Bahmni.Common.Constants.conceptUrl,
                {
                    method: "GET",
                    params: {
                        q: name,
                        v: 'custom:(uuid,name,answers:(name:(name)))'
                    },
                    withCredentials: true
                }]);
        });
    });
});