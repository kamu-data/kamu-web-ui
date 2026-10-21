/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import { findComponentInstance } from "@common/helpers/base-test.helpers.spec";

@Component({
    template: `
        <form [formGroup]="form">
            <input
                formControlName="name"
                [appFieldError]="[]"
                [group]="form"
                [fieldControl]="form.get('name')"
                fieldLabel="Name"
            />
        </form>
    `,
    imports: [ReactiveFormsModule, FormValidationErrorsDirective],
})
class TestHostComponent {
    public form = new FormGroup({
        name: new FormControl(""),
    });
}

describe("FormValidationErrorsDirective", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let directiveInstance: FormValidationErrorsDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormValidationErrorsDirective, TestHostComponent],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();

        directiveInstance = findComponentInstance(fixture, FormValidationErrorsDirective);
    });

    it("should create the directive instance", () => {
        expect(directiveInstance).toBeTruthy();
    });
});
