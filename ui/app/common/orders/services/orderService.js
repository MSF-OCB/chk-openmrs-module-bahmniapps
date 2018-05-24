'use strict';

angular.module('bahmni.common.orders')
    .factory('orderService', ['$http', '$q', function ($http, $q) {
        var getOrders = function (data) {
            var params = {
                concept: data.conceptNames,
                includeObs: data.includeObs,
                patientUuid: data.patientUuid,
                numberOfVisits: data.numberOfVisits
            };

            if (data.obsIgnoreList) {
                params.obsIgnoreList = data.obsIgnoreList;
            }
            if (data.orderTypeUuid) {
                params.orderTypeUuid = data.orderTypeUuid;
            }
            if (data.orderUuid) {
                params.orderUuid = data.orderUuid;
            }
            if (data.visitUuid) {
                params.visitUuid = data.visitUuid;
            }
            if (data.locationUuids && data.locationUuids.length > 0) {
                params.numberOfVisits = 0;
                params.locationUuids = data.locationUuids;
            }
            return $http.get(Bahmni.Common.Constants.bahmniOrderUrl, {
                params: params,
                withCredentials: true
            }).then(function (res) {
                return $q.when({data: updateOrdersComments(res.data)});
            });
        };

        var updateOrdersComments = function (orders) {
            _.forEach(orders, function (order) {
                order.visitType = _.words(order.commentToFulfiller, /\[\[.*\]\]\s*/)[0];
                order.commentToFulfiller = _.replace(order.commentToFulfiller, /\[\[.*\]\]\s*/, "");
            });
            return orders;
        };
        return {
            getOrders: getOrders,
            updateOrdersComments: updateOrdersComments
        };
    }]);
