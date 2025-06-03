/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { FormValidationErrorsDirective } from "./form-validation-errors.directive";

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
            declarations: [FormValidationErrorsDirective, TestHostComponent],
            imports: [ReactiveFormsModule],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();

        const debugElement: DebugElement = fixture.debugElement.query(By.directive(FormValidationErrorsDirective));
        directiveInstance = debugElement.injector.get(FormValidationErrorsDirective);
    });

    it("should create the directive instance", () => {
        expect(directiveInstance).toBeTruthy();
    });
});
