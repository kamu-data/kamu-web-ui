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
import { Component, ViewChild } from "@angular/core";
import { TimeDeltaFormHarness } from "./time-delta-form.harness";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";

@Component({
    standalone: true,
    imports: [TimeDeltaFormComponent],
    template: `<app-time-delta-form [label]="'Launch every:'" />`,
})
class TestTimeDeltaFormComponent {
    @ViewChild(TimeDeltaFormComponent)
    public formComponent: TimeDeltaFormComponent;
}

describe("TimeDeltaFormComponent", () => {
    let hostComponent: TestTimeDeltaFormComponent;
    let component: TimeDeltaFormComponent;
    let fixture: ComponentFixture<TestTimeDeltaFormComponent>;
    let loader: HarnessLoader;
    let timeDeltaHarness: TimeDeltaFormHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestTimeDeltaFormComponent],
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

        fixture = TestBed.createComponent(TestTimeDeltaFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        loader = TestbedHarnessEnvironment.loader(fixture);
        timeDeltaHarness = await loader.getHarness(TimeDeltaFormHarness);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
        expect(hostComponent).toBeTruthy();
        expect(timeDeltaHarness).toBeTruthy();
    });

    it("should initialize with default values", () => {
        expect(component.everyControl.value).toBeNull();
        expect(component.unitControl.value).toBeNull();
    });

    it("should update form value when writeValue is called", () => {
        const testValue = { every: 5, unit: TimeUnit.Hours };
        component.writeValue(testValue);

        expect(component.everyControl.value).toBe(5);
        expect(component.unitControl.value).toBe(TimeUnit.Hours);
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

    it("should set time delta values as a user", async () => {
        await timeDeltaHarness.setTimeDelta(5, TimeUnit.Hours);

        const timeDelta = await timeDeltaHarness.getTimeDelta();
        expect(timeDelta.every).toBe(5);
        expect(timeDelta.unit).toBe(TimeUnit.Hours);
    });

    it("should show validation error for invalid range", async () => {
        await timeDeltaHarness.setTimeDelta(-5, TimeUnit.Minutes);

        const isInvalid = await timeDeltaHarness.isEveryInputInvalid();
        expect(isInvalid).toBeTrue();

        const isUntouched = await timeDeltaHarness.isEveryInputUntouched();
        expect(isUntouched).toBeFalse();

        const errorMessage = await timeDeltaHarness.getErrorMessage();
        expect(errorMessage).toEqual("Value should be between 0 to 60");
    });

    it("should not show error for valid time delta using harness", async () => {
        await timeDeltaHarness.setTimeDelta(30, TimeUnit.Minutes);

        const isInvalid = await timeDeltaHarness.isEveryInputInvalid();
        expect(isInvalid).toBeFalse();

        const isUntouched = await timeDeltaHarness.isEveryInputUntouched();
        expect(isUntouched).toBeFalse();

        const errorMessage = await timeDeltaHarness.getErrorMessage();
        expect(errorMessage).toBeNull();
    });

    it("should not display error message if every input was not touched even though it is invalid", async () => {
        const isInvalid = await timeDeltaHarness.isEveryInputInvalid();
        expect(isInvalid).toBeTrue();

        const isUntouched = await timeDeltaHarness.isEveryInputUntouched();
        expect(isUntouched).toBeTrue();

        const errorMessage = await timeDeltaHarness.getErrorMessage();
        expect(errorMessage).toBeNull();
    });
});
