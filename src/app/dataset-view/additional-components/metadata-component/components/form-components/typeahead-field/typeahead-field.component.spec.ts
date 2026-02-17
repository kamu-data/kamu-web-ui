/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { interval } from "rxjs";
import { map, take } from "rxjs/operators";

import { TypeaheadFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/typeahead-field/typeahead-field.component";

import { getInputElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";

describe("TypeaheadFieldComponent", () => {
    let component: TypeaheadFieldComponent;
    let fixture: ComponentFixture<TypeaheadFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TypeaheadFieldComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TypeaheadFieldComponent);
        component = fixture.componentInstance;
        component.data = ["test1", "test2"];
        component.controlName = "name";
        component.dataTestId = "typeahead";
        component.form = new FormGroup({
            name: new FormControl(""),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check call search method", fakeAsync(() => {
        const inputEl = getInputElementByDataTestId(fixture, "typeahead");
        inputEl.click();
        const textMock$ = interval(100).pipe(
            take(2),
            map((index) => component.data[index]),
        );
        component.search(textMock$).subscribe((result) => {
            expect(result).toEqual(["test2"]);
        });
        tick(AppValues.SHORT_DELAY_MS);
        expect(component.focus$).toBeDefined();
        expect(component.click$).toBeDefined();
        flush();
    }));
});
