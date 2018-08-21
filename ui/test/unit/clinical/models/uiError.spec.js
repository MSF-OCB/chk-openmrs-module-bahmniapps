'use strict';

describe("UiErrorSpec", function () {

    var uiErrorSpec = Bahmni.Clinical.Error;

    it("maps error messages from the source error object", function () {
        var expectedErrorMessage = "CANNOT_HAVE_MORE_THAN_ONE_ACTIVE_ORDER";
        var error = {data: {
            error: {
                message: "Cannot have more than one active order for the same orderable and care setting at same time"
            }
        }};
        expect(expectedErrorMessage).toBe(uiErrorSpec.translate(error));
    });

    it("returns original message if no mapping found", function () {
        var expectedErrorMessage = "Message not found in mapping";
        var error = {data: {
            error: {
                message: "Message not found in mapping"
            }
        }};
        expect(expectedErrorMessage).toBe(uiErrorSpec.translate(error));
    });

    it("returns original message if no mapping found", function () {
        var expectedErrorMessage = "Message not found in mapping";
        var error = {data: {
            error: {
                message: "Message not found in mapping"
            }
        }};

        expect(expectedErrorMessage).toBe(uiErrorSpec.translate(error));
    });

    it("returns null if cannot parse object", function () {
        var error = {that: "Does not follow the typical error message structure"};
        expect(uiErrorSpec.translate(error)).toBeFalsy();
    });

    it("should not fail for falsy objects", function () {
        uiErrorSpec.translate(null);
    });
});
