/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { NativeInputHarness } from "@common/helpers/native-input.harness";
import { FieldErrorHarness } from "@common/validation/field-error.harness";
import {
    fieldErrorMessage,
    FormValidationErrorsDirective,
    validationErrorMessage,
} from "@common/validation/form-validation-errors.directive";
import { ValidationError } from "@common/validation/form-validation-errors.types";
import { setServerError } from "@common/validation/server-errors.helpers";

@Component({
    template: `
        <form [formGroup]="form">
            <input #nameInput formControlName="name" data-test-id="name-input" />
            <div [input]="nameInput" [group]="form" [fieldLabel]="label" dataTestId="name-error" appFieldError></div>
        </form>
    `,
    imports: [ReactiveFormsModule, FormValidationErrorsDirective],
})
class TestHostComponent {
    public label = "Name";
    public form = new FormGroup({
        name: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.maxLength(3)] }),
    });
}

describe("FormValidationErrorsDirective", () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let loader: HarnessLoader;
    let error: FieldErrorHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [TestHostComponent] });
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
        error = await loader.getHarness(FieldErrorHarness.with({ dataTestId: "name-error" }));
    });

    async function nameInput(): Promise<NativeInputHarness> {
        return loader.getHarness(NativeInputHarness.with({ dataTestId: "name-input" }));
    }

    it("should show nothing before the user touches the field", async () => {
        expect(await error.getMessage()).toBeNull();
    });

    it("should show the first error once the field is blurred", async () => {
        const input = await nameInput();
        await input.touch();

        expect(await error.getMessage()).toBe("Name is required");
    });

    it("should follow the value as the user types", async () => {
        const input = await nameInput();
        await input.setValue("abcd");
        expect(await error.getMessage()).toBe("Name can't exceed 3 characters");

        await input.setValue("abc");
        expect(await error.getMessage()).toBeNull();
    });

    it("should show an error the server returned until the value changes", async () => {
        const input = await nameInput();
        await input.setValue("abc");

        setServerError(fixture.componentInstance.form.controls.name, "Name is taken");
        expect(await error.getMessage()).toBe("Name is taken");

        await input.setValue("abd");
        expect(await error.getMessage()).toBeNull();
    });

    it("should use a new label in the message", async () => {
        const input = await nameInput();
        await input.touch();

        fixture.componentInstance.label = "Title";
        fixture.detectChanges();

        expect(await error.getMessage()).toBe("Title is required");
    });
});

@Component({
    template: `
        <form [formGroup]="form">
            <input #nameInput data-test-id="name-input" />
            <div [input]="nameInput" [group]="form" fieldLabel="Name" appFieldError></div>
        </form>
    `,
    imports: [ReactiveFormsModule, FormValidationErrorsDirective],
})
class TestUnboundHostComponent {
    public form = new FormGroup({});
}

describe("FormValidationErrorsDirective on an input bound to no control", () => {
    it("should say which field is bound to no control", () => {
        TestBed.configureTestingModule({ imports: [TestUnboundHostComponent] });
        const fixture = TestBed.createComponent(TestUnboundHostComponent);

        expect(() => fixture.detectChanges()).toThrow('[appFieldError] "Name" is bound to no control');
    });
});

describe("fieldErrorMessage", () => {
    it("should describe the first error", () => {
        expect(fieldErrorMessage("Port", { required: true, min: { min: 1 } })).toBe("Port is required");
    });

    it("should throw on an error that has no message", () => {
        expect(() => fieldErrorMessage("Name", { somethingElse: true })).toThrow(
            '[appFieldError] "Name" has the error "somethingElse", which has no message',
        );
    });
});

describe("validationErrorMessage", () => {
    const cases: { error: ValidationError; details: unknown; message: string }[] = [
        { error: "required", details: true, message: "Port is required" },
        { error: "minlength", details: { requiredLength: 8 }, message: "Port must be at least 8 characters" },
        { error: "maxlength", details: { requiredLength: 100 }, message: "Port can't exceed 100 characters" },
        { error: "maxBytes", details: { max: 16384, actual: 16385 }, message: "Port can't exceed 16384 bytes" },
        { error: "passwordsMismatch", details: true, message: "Passwords mismatch" },
        { error: "email", details: true, message: "Please provide a valid email address" },
        { error: "min", details: { min: 1 }, message: "Port must be at least 1" },
        { error: "max", details: { max: 65535 }, message: "Port must be at most 65535" },
        { error: "integer", details: true, message: "Port must be a whole number" },
        { error: "blank", details: true, message: "Port can't be blank" },
        { error: "singleChar", details: true, message: "Port must be a single ASCII character" },
        { error: "format", details: { message: "may only contain digits" }, message: "Port may only contain digits" },
        {
            error: "url",
            details: { schemes: ["http", "https"] },
            message: "Port must be a URL starting with http://, https://",
        },
        { error: "invalidCronExpression", details: "Bad cron", message: "Bad cron" },
        { error: "duplicate", details: true, message: "Port already exists" },
        {
            error: "requiredUnless",
            details: { sibling: "Node URL" },
            message: "Port is required unless Node URL is set",
        },
        { error: "duplicateItems", details: { value: "a" }, message: 'Port contains "a" more than once' },
        { error: "server", details: { message: "Rejected" }, message: "Rejected" },
    ];
    // Details a validator left out, or stored in another shape, still give a readable message.
    const casesWithoutDetails: { error: ValidationError; details: unknown; message: string }[] = [
        { error: "format", details: true, message: "Port has the wrong format" },
        { error: "url", details: true, message: "Port must be a URL" },
        { error: "invalidCronExpression", details: true, message: "Port is not a valid cron expression" },
        { error: "requiredUnless", details: true, message: "Port is required" },
        { error: "duplicateItems", details: { value: 1 }, message: "Port contains a value more than once" },
        { error: "server", details: true, message: "Port was rejected by the server" },
    ];

    cases.forEach(({ error, details, message }) => {
        it(`should describe "${error}"`, () => {
            expect(validationErrorMessage("Port", error, details)).toBe(message);
        });
    });

    casesWithoutDetails.forEach(({ error, details, message }) => {
        it(`should describe "${error}" without its details`, () => {
            expect(validationErrorMessage("Port", error, details)).toBe(message);
        });
    });
});
