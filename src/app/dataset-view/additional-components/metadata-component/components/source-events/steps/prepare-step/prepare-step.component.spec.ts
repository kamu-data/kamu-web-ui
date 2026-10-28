/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormArray, FormGroup, FormGroupDirective } from "@angular/forms";

import { Apollo } from "apollo-angular";

import { emitClickOnElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import {
    DecompressFormat,
    PrepareKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { PrepareStepForm } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { PrepareStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/prepare-step/prepare-step.component";
import { PrepareStepHarness } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/prepare-step/prepare-step.harness";

describe("PrepareStepComponent", () => {
    let component: PrepareStepComponent;
    let fixture: ComponentFixture<PrepareStepComponent>;
    let prepareForm: FormArray<PrepareStepForm>;

    beforeEach(async () => {
        prepareForm = new FormArray<PrepareStepForm>([]);
        const formGroupDirective = new FormGroupDirective([], []);
        formGroupDirective.form = new FormGroup({ prepare: prepareForm });
        await TestBed.configureTestingModule({
            providers: [Apollo, { provide: FormGroupDirective, useValue: formGroupDirective }],
            imports: [SharedTestModule, PrepareStepComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PrepareStepComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "sectionName", SetPollingSourceSection.PREPARE);
        setComponentInput(fixture, "sectionForm", prepareForm);
        fixture.detectChanges();
    });

    it("should start with no steps", () => {
        expect(component.sectionForm.length).toEqual(0);
    });

    it("should add and delete a pipe step", () => {
        emitClickOnElementByDataTestId(fixture, "add-pipe");
        fixture.detectChanges();
        expect(prepareForm.getRawValue()).toEqual([{ kind: PrepareKind.PIPE, command: "" }]);

        emitClickOnElementByDataTestId(fixture, "remove-item-0");
        expect(prepareForm.length).toEqual(0);
    });

    it("should add a decompress step and move it down", () => {
        const decompress = {
            kind: PrepareKind.DECOMPRESS,
            format: DecompressFormat.ZIP,
            subPath: "",
        };
        emitClickOnElementByDataTestId(fixture, "add-decompress");
        emitClickOnElementByDataTestId(fixture, "add-pipe");
        fixture.detectChanges();
        expect(prepareForm.at(0).getRawValue()).toEqual(decompress);

        emitClickOnElementByDataTestId(fixture, "move-down-item-0");
        expect(prepareForm.at(1).getRawValue()).toEqual(decompress);
    });

    it("should require a pipe command", async () => {
        const prepareStep = await TestbedHarnessEnvironment.harnessForFixture(fixture, PrepareStepHarness);
        await prepareStep.addPipe();

        await prepareStep.setCommand(0, "");

        expect(await prepareStep.getCommandError(0)).toBe("Command is required");
        expect(prepareForm.valid).toBe(false);
    });

    it("should reject a pipe command of only spaces, which leaves kamu-cli nothing to run", async () => {
        const prepareStep = await TestbedHarnessEnvironment.harnessForFixture(fixture, PrepareStepHarness);
        await prepareStep.addPipe();

        await prepareStep.setCommand(0, "   ");

        expect(await prepareStep.getCommandError(0)).toBe("Command can't be blank");
        expect(prepareForm.valid).toBe(false);
    });

    it("should accept a pipe command", async () => {
        const prepareStep = await TestbedHarnessEnvironment.harnessForFixture(fixture, PrepareStepHarness);
        await prepareStep.addPipe();

        await prepareStep.setCommand(0, "jq -c .[]");

        expect(await prepareStep.getCommandError(0)).toBeNull();
        expect(prepareForm.getRawValue()).toEqual([{ kind: PrepareKind.PIPE, command: "jq -c .[]" }]);
    });
});
