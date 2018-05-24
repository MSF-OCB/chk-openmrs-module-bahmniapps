'use strict';

describe('Order Service', function () {
    var orderService, q;
    var mockHttp = jasmine.createSpyObj('$http', ['get']);
    mockHttp.get.and.callFake(function(param) {
        return specUtil.respondWithPromise(Q, { data: [{ commentToFulfiller: "[[ IPD ]] comment" }] });
    });

    beforeEach(function () {
        module('bahmni.common.orders');
        module(function ($provide) {
            $provide.value('$http', mockHttp);
            $provide.value('$q', Q);
        });

        inject(['orderService', function (orderServiceInjected) {
            orderService = orderServiceInjected;
        }]);
    });

    it('getOrders should return orders and observations based on orderType if specified', function (done) {
        var params = {
            patientUuid:"somePatientUuid",
            orderTypeUuid:"someOrderTypeUuid",
            includeObs:true,
            numberOfVisits:10,
            conceptNames : "someConceptName"
        };

        orderService.getOrders(params).then(function(response) {
            expect(response.data[0].commentToFulfiller).toEqual("comment");
            expect(response.data[0].visitType).toEqual("[[ IPD ]] ");
            done();
        });
        expect(mockHttp.get).toHaveBeenCalled();
        expect(mockHttp.get.calls.mostRecent().args[0]).toBe(Bahmni.Common.Constants.bahmniOrderUrl);
        expect(mockHttp.get.calls.mostRecent().args[1].params).toEqual({
            patientUuid:"somePatientUuid",
            orderTypeUuid:"someOrderTypeUuid",
            includeObs:true,
            numberOfVisits:10,
            concept : "someConceptName"
        });
    });

    it('getOrders should return orders and observations based on orderUuid if specified', function (done) {
        var params = {
            patientUuid:"somePatientUuid",
            includeObs:true,
            numberOfVisits:1,
            obsIgnoreList:10,
            orderUuid:"someOrderUuid",
            conceptNames : "someConceptName"
        };

        orderService.getOrders(params).then(function(response) {
            expect(response.data[0].commentToFulfiller).toEqual("comment");
            expect(response.data[0].visitType).toEqual("[[ IPD ]] ");
            done();
        });
        expect(mockHttp.get).toHaveBeenCalled();
        expect(mockHttp.get.calls.mostRecent().args[0]).toBe(Bahmni.Common.Constants.bahmniOrderUrl);
        expect(mockHttp.get.calls.mostRecent().args[1].params).toEqual({
            patientUuid:"somePatientUuid",
            includeObs:true,
            numberOfVisits:1,
            obsIgnoreList:10,
            orderUuid:"someOrderUuid",
            concept : "someConceptName"
        });
    });

    it('getOrders should return orders and observations based on visitUuid if specified', function (done) {
        var params = {
            patientUuid:"somePatientUuid",
            includeObs:true,
            numberOfVisits:1,
            obsIgnoreList:10,
            visitUuid:"someVisitUuid",
            orderUuid:"someOrderUuid",
            conceptNames : "someConceptName"
        };

        orderService.getOrders(params).then(function(response) {
            expect(response.data[0].commentToFulfiller).toEqual("comment");
            expect(response.data[0].visitType).toEqual("[[ IPD ]] ");
            done();
        });
        expect(mockHttp.get).toHaveBeenCalled();
        expect(mockHttp.get.calls.mostRecent().args[0]).toBe(Bahmni.Common.Constants.bahmniOrderUrl);
        expect(mockHttp.get.calls.mostRecent().args[1].params).toEqual({
            patientUuid:"somePatientUuid",
            includeObs:true,
            numberOfVisits:1,
            obsIgnoreList:10,
            visitUuid:"someVisitUuid",
            orderUuid:"someOrderUuid",
            concept: "someConceptName"
        });
    });

    it("getOrders should make http get request with params which are truthy",function (done) {
        var params = {
            patientUuid:"somePatientUuid",
            includeObs:true,
            numberOfVisits:1,
            obsIgnoreList:undefined,
            visitUuid:undefined,
            orderUuid:undefined,
            orderTypeUuid:undefined,
            conceptNames:"someConceptName",
            locationUuids : []
        };
        orderService.getOrders(params).then(function() {
            done();
        });
        expect(mockHttp.get.calls.mostRecent().args[1].params).toEqual({
            patientUuid:"somePatientUuid",
            includeObs:true,
            numberOfVisits:1,
            concept:"someConceptName"
        });
    });

    it("getOrders should make http get request with location uuids when specified", function (done) {
        var params = {
            patientUuid:"somePatientUuid",
            includeObs:true,
            numberOfVisits:2,
            obsIgnoreList:undefined,
            visitUuid:undefined,
            orderUuid:undefined,
            orderTypeUuid:undefined,
            conceptNames:"someConceptName",
            locationUuids:["uuid1", "uuid2", "uuid3"]
        };
        orderService.getOrders(params).then(function() {
            done();
        });
        expect(mockHttp.get.calls.mostRecent().args[1].params).toEqual({
            patientUuid:"somePatientUuid",
            includeObs:true,
            numberOfVisits:0,
            concept:"someConceptName",
            locationUuids:["uuid1", "uuid2", "uuid3"]
        });
    });

    describe("updateOrdersComments", function () {
        it("should remove visit type from comments and add as separate fields if visit type exist", function () {
            var orders = [{ commentToFulfiller: "[[ IPD ]] comment1" }, { commentToFulfiller: "comment2" }];

            var updateOrdersComments = orderService.updateOrdersComments(orders);

            expect(updateOrdersComments[0].commentToFulfiller).toEqual("comment1");
            expect(updateOrdersComments[0].visitType).toEqual("[[ IPD ]] ");
            expect(updateOrdersComments[1].commentToFulfiller).toEqual("comment2");
            expect(updateOrdersComments[1].visitType).toEqual(undefined);
        });
    })
});