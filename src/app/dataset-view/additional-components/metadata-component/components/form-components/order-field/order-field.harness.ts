/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { TestElement } from "@angular/cdk/testing";

import { BaseFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";

export class OrderFieldHarness extends BaseFieldHarness {
    public static readonly hostSelector = "app-order-field";

    public async selectOrder(order: SourceOrder): Promise<void> {
        const radio = await this.radio(order);
        await radio.click();
    }

    public async isOrderSelected(order: SourceOrder): Promise<boolean> {
        const radio = await this.radio(order);
        return this.isElementChecked(radio);
    }

    /** The radio of `order`, whose test id is the field's `dataTestId`, a dash and the order. */
    private async radio(order: SourceOrder): Promise<TestElement> {
        return this.element(`-${order}`);
    }
}
