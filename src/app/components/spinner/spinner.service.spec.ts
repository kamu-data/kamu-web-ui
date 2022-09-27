import { TestBed } from "@angular/core/testing";

import { SpinnerService } from "./spinner.service";

describe("SpinnerService", () => {
    let service: SpinnerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SpinnerService);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    [true, false].forEach((expectation: boolean) => {
        it(`should be call _isLoading subject with ${String(
            expectation,
        )}`, () => {
            const isLoadingSpy = spyOn(service["_isLoading$"], "next");
            expectation ? service.show() : service.hide();
            expect(isLoadingSpy).toHaveBeenCalledWith(expectation);
        });
    });
});
