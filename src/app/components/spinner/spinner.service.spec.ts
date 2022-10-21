import { TestBed } from "@angular/core/testing";
import { first } from "rxjs/operators";
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
        )}`, async () => {
            const subscription$ = service.isLoading.pipe(first()).subscribe(
                (loading: boolean) => void expect(loading).toEqual(expectation)
            )
            expectation ? service.show() : service.hide();
            await expect(subscription$.closed).toBeTruthy();
        });
    });
});
