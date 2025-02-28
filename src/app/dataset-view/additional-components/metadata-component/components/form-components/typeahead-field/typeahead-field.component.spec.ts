/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgbTooltipModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";

import { TypeaheadFieldComponent } from "./typeahead-field.component";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { getInputElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { interval } from "rxjs";
import { map, take } from "rxjs/operators";
import AppValues from "src/app/common/values/app.values";
import { ActivatedRoute } from "@angular/router";

describe("TypeaheadFieldComponent", () => {
    let component: TypeaheadFieldComponent;
    let fixture: ComponentFixture<TypeaheadFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TypeaheadFieldComponent, TooltipIconComponent],
            imports: [NgbTypeaheadModule, MatIconModule, FormsModule, ReactiveFormsModule, NgbTooltipModule],
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
