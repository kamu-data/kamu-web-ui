/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { InputFieldComponent } from "../../../form-components/input-field/input-field.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SourceNameStepComponent } from "./source-name-step.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("SourceNameStepComponent", () => {
    let component: SourceNameStepComponent;
    let fixture: ComponentFixture<SourceNameStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                NgbTooltipModule,
                SharedTestModule,
                SourceNameStepComponent,
                InputFieldComponent,
                TooltipIconComponent,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SourceNameStepComponent);
        component = fixture.componentInstance;
        component.form = component.form = new FormGroup({
            sourceName: new FormControl(""),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
