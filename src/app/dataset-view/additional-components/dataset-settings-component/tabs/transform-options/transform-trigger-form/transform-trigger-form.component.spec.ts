/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TransformTriggerFormComponent } from "./transform-trigger-form.component";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { Component, ViewChild } from "@angular/core";
import { HarnessLoader } from "@angular/cdk/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { TransformTriggerFormHarness } from "./transform-trigger-form.harness";

@Component({
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        TransformTriggerFormComponent,
    ],
    template: `<app-transform-trigger-form
        [form]="hostForm.controls.transformTrigger"
        [updateStateToggleLabel]="label"
    />`,
})
class TestTransformTriggerFormComponent {
    public readonly label = "Enable automatic updates";

    public readonly hostForm = new FormGroup({
        transformTrigger: TransformTriggerFormComponent.buildForm(),
    });

    @ViewChild(TransformTriggerFormComponent)
    public formComponent: TransformTriggerFormComponent;
}

describe("TransformTriggerFormComponent", () => {
    let hostComponent: TestTransformTriggerFormComponent;
    let component: TransformTriggerFormComponent;

    let fixture: ComponentFixture<TestTransformTriggerFormComponent>;

    let loader: HarnessLoader;
    let transformTriggerFormHarness: TransformTriggerFormHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [
                //-----//
                SharedTestModule,
                TestTransformTriggerFormComponent,
            ],
        });
        fixture = TestBed.createComponent(TestTransformTriggerFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        loader = TestbedHarnessEnvironment.loader(fixture);
        transformTriggerFormHarness = await loader.getHarness(TransformTriggerFormHarness);
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
        expect(component).toBeTruthy();
        expect(transformTriggerFormHarness).toBeTruthy();
    });

    it("should enable updates toggle via harness and reflect in form", async () => {
        expect(component.updatesEnabledControl.value).toBeFalse();

        await transformTriggerFormHarness.enableUpdates();
        expect(component.updatesEnabledControl.value).toBeTrue();
        expect(component.batchingRuleTypeControl.disabled).toBeFalse();
        expect(component.forNewDataControl.disabled).toBeFalse();
        expect(component.forBreakingChangeControl.disabled).toBeFalse();

        await transformTriggerFormHarness.disableUpdates();
        expect(component.updatesEnabledControl.value).toBeFalse();
        expect(component.batchingRuleTypeControl.disabled).toBeTrue();
        expect(component.forNewDataControl.disabled).toBeTrue();
        expect(component.forBreakingChangeControl.disabled).toBeTrue();
    });
});
