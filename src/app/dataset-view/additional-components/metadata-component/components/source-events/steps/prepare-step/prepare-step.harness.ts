/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { NativeInputHarness } from "@common/helpers/native-input.harness";
import { FieldErrorHarness } from "@common/validation/field-error.harness";
import { MaybeNull } from "@interface/app.types";

export class PrepareStepHarness extends ComponentHarness {
    public static readonly hostSelector = "app-prepare-step";

    private static readonly ADD_PIPE_TEST_ID = "add-pipe";
    private static readonly COMMAND_INPUT_TEST_ID_PREFIX = "pipe-command-";
    private static readonly COMMAND_ERROR_TEST_ID_PREFIX = "pipe-command-error-";

    private readonly locatorAddPipeButton = this.locatorFor(`[data-test-id="${PrepareStepHarness.ADD_PIPE_TEST_ID}"]`);

    public async addPipe(): Promise<void> {
        const button = await this.locatorAddPipeButton();
        await button.click();
    }

    public async setCommand(index: number, command: string): Promise<void> {
        const input = await this.locatorFor(
            NativeInputHarness.with({ dataTestId: `${PrepareStepHarness.COMMAND_INPUT_TEST_ID_PREFIX}${index}` }),
        )();
        await input.setValue(command);
    }

    public async getCommandError(index: number): Promise<MaybeNull<string>> {
        const error = await this.locatorFor(
            FieldErrorHarness.with({ dataTestId: `${PrepareStepHarness.COMMAND_ERROR_TEST_ID_PREFIX}${index}` }),
        )();
        return error.getMessage();
    }
}
