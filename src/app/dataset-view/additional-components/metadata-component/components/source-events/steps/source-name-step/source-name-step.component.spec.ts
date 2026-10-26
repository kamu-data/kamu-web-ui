/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { SourceNameStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/source-name-step/source-name-step.component";

describe("SourceNameStepComponent", () => {
    let component: SourceNameStepComponent;
    let fixture: ComponentFixture<SourceNameStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SourceNameStepComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SourceNameStepComponent);
        component = fixture.componentInstance;
        setComponentInput(
            fixture,
            "form",
            new FormGroup({
                sourceName: new FormControl(""),
            }),
        );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
