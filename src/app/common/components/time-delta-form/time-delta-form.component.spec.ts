/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { TimeDeltaFormComponent } from "./time-delta-form.component";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";

describe("TimeDeltaFormComponent", () => {
    let component: TimeDeltaFormComponent;
    let fixture: ComponentFixture<TimeDeltaFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TimeDeltaFormComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: {} },
                        params: { subscribe: () => {} },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TimeDeltaFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize with default values", () => {
        expect(component.form.get("every")?.value).toBeNull();
        expect(component.form.get("unit")?.value).toBeNull();
    });

    it("should update form value when writeValue is called", () => {
        const testValue = { every: 5, unit: TimeUnit.Hours };
        component.writeValue(testValue);

        expect(component.form.get("every")?.value).toBe(5);
        expect(component.form.get("unit")?.value).toBe(TimeUnit.Hours);
    });

    it("should disable form when setDisabledState is called with true", () => {
        component.setDisabledState(true);
        expect(component.form.disabled).toBe(true);
    });

    it("should enable form when setDisabledState is called with false", () => {
        component.setDisabledState(false);
        expect(component.form.disabled).toBe(false);
    });

    it("should emit formChange when form values change", () => {
        const emitSpy = spyOn(component.formChange, "emit");

        component.form.patchValue({ every: 10, unit: TimeUnit.Minutes });

        expect(emitSpy).toHaveBeenCalledWith(component.form);
    });
});
