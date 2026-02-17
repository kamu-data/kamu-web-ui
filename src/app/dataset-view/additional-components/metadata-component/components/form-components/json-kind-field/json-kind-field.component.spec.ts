/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { JsonKindFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/json-kind-field/json-kind-field.component";
import { ReadKind } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

describe("JsonKindFieldComponent", () => {
    let component: JsonKindFieldComponent;
    let fixture: ComponentFixture<JsonKindFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, JsonKindFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(JsonKindFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({
            jsonKind: new FormControl(ReadKind.JSON),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
