/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from "@angular/cdk/testing";

import { withDataTestId } from "@common/helpers/native-input.harness";
import { MaybeNull } from "@interface/app.types";

export interface FieldErrorHarnessFilters extends BaseHarnessFilters {
    /** The `dataTestId` the template passes to the `appFieldError` element. */
    dataTestId?: string;
}

/** The message `FormValidationErrorsDirective` renders under a field. */
export class FieldErrorHarness extends ComponentHarness {
    public static readonly hostSelector = "[appFieldError]";

    public static with(options: FieldErrorHarnessFilters = {}): HarnessPredicate<FieldErrorHarness> {
        return withDataTestId(new HarnessPredicate(FieldErrorHarness, options), options.dataTestId);
    }

    /** The message shown, or `null` when the field shows none. */
    public async getMessage(): Promise<MaybeNull<string>> {
        const host = await this.host();
        const text = await host.text();
        return text === "" ? null : text;
    }
}
