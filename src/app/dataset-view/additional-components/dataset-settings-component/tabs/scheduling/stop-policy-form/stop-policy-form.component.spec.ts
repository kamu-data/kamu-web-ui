/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { HarnessLoader } from "@angular/cdk/testing";
import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StopPolicyFormComponent } from "./stop-policy-form.component";
import { StopPolicyFormHarness } from "./stop-policy-form.harness";

@Component({
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        StopPolicyFormComponent,
    ],
    template: `<app-stop-policy-form [form]="hostForm.controls.stopPolicy" />`,
})
class TestStopPolicyFormComponent {
    public readonly hostForm = new FormGroup({
        stopPolicy: StopPolicyFormComponent.buildForm(),
    });

    @ViewChild(StopPolicyFormComponent)
    public formComponent: StopPolicyFormComponent;
}

describe("StopPolicyFormComponent", () => {
    let hostComponent: TestStopPolicyFormComponent;
    let component: StopPolicyFormComponent;

    let fixture: ComponentFixture<TestStopPolicyFormComponent>;
    let loader: HarnessLoader;
    let stopPolicyFormHarness: StopPolicyFormHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [
                //-----//
                SharedTestModule,
                TestStopPolicyFormComponent,
            ],
        });
        fixture = TestBed.createComponent(TestStopPolicyFormComponent);
        hostComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();

        component = hostComponent.formComponent;

        loader = TestbedHarnessEnvironment.loader(fixture);
        stopPolicyFormHarness = await loader.getHarness(StopPolicyFormHarness);
    });

    it("should create", () => {
        expect(hostComponent).toBeTruthy();
        expect(component).toBeTruthy();
        expect(stopPolicyFormHarness).toBeTruthy();
    });
});
