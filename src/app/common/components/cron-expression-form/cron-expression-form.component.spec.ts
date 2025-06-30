/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CronExpressionFormComponent } from "./cron-expression-form.component";

describe("CronExpressionFormComponent", () => {
    let component: CronExpressionFormComponent;
    let fixture: ComponentFixture<CronExpressionFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CronExpressionFormComponent],
            imports: [ReactiveFormsModule],
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

        fixture = TestBed.createComponent(CronExpressionFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize with default values", () => {
        expect(component.form.get("cronExpression")?.value).toBe("");
    });

    it("should update form value when writeValue is called", () => {
        const testValue = { cronExpression: "0 9 * * MON" };
        component.writeValue(testValue);

        expect(component.form.get("cronExpression")?.value).toBe("0 9 * * MON");
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

        component.form.patchValue({ cronExpression: "0 9 * * MON" });

        expect(emitSpy).toHaveBeenCalledWith(component.form);
    });

    it("should validate cron expression", () => {
        const cronControl = component.form.get("cronExpression");

        // Invalid cron expression
        cronControl?.setValue("invalid");
        cronControl?.markAsTouched();
        expect(cronControl?.hasError("invalidCronExpression")).toBe(true);

        // Valid cron expression (basic format that should pass)
        cronControl?.setValue("* * * * *");
        expect(cronControl?.hasError("invalidCronExpression")).toBe(false);
    });
});
