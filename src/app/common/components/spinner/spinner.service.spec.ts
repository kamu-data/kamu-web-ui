/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { first } from "rxjs/operators";

import { SpinnerService } from "@common/components/spinner/spinner.service";

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
            const subscription$ = service.isLoadingChanges
                .pipe(first())
                .subscribe((loading: boolean) => expect(loading).toEqual(expectation));
            if (expectation) {
                service.show();
            } else {
                service.hide();
            }
            expect(subscription$.closed).toBeTrue();
        });
    });
});
