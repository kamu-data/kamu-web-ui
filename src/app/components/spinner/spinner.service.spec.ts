import { TestBed } from "@angular/core/testing";
import { first } from "rxjs/operators";
import { SpinnerService } from "./spinner.service";

describe("SpinnerService", () => {
    let service: SpinnerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SpinnerService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    [true, false].forEach((expectation: boolean) => {
        it(`should call _isLoading subject with ${String(expectation)}`, () => {
            const subscription$ = service.isLoading
                .pipe(first())
                .subscribe((loading: boolean) => expect(loading).toEqual(expectation));
            expectation ? service.show() : service.hide();
            expect(subscription$.closed).toBeTrue();
        });
    });
});
