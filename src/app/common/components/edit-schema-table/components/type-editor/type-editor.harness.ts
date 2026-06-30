/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { selectNgOption } from "@common/helpers/ng-select-harness.helpers";
import { OdfTypes } from "@interface/dataset-schema.interface";

export class TypeEditorHarness extends ComponentHarness {
    public static readonly hostSelector = "app-type-editor";

    // ng-select renders the chosen value inside this span
    private readonly locatorValueLabel = this.locatorForOptional(".ng-value-label");

    /** Returns the text currently shown in the kind ng-select container (the selected label). */
    public async getDisplayedKind(): Promise<string> {
        const label = await this.locatorValueLabel();
        return label ? (await label.text()).trim() : "";
    }

    /**
     * Opens the kind panel and selects the given ODF type.
     * Uses selectNgOption from ng-select-harness.helpers — the only ng-select-driving code.
     */
    public async openKindPanelAndSelect(kind: OdfTypes): Promise<void> {
        const host = await this.host();
        const typePath = await host.getAttribute("data-test-id");

        if (!typePath) {
            throw new Error("TypeEditorHarness: host has no data-test-id — cannot derive kind select id");
        }

        await selectNgOption(this, `${typePath}:kind`, `${typePath}:kind-option:${kind}`);
    }
}
