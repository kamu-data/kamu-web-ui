/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { MaybeNull } from "@interface/app.types";

export class BaseDynamicEventHarness extends ComponentHarness {
    public static readonly hostSelector = [
        "app-add-data-event",
        "app-add-push-source-event",
        "app-execute-transform-event",
        "app-set-polling-source-event",
        "app-set-transform-event",
    ].join(", ");

    private static readonly SECTION_TITLE_TEST_ID = "event-section-title";

    private readonly locatorSectionTitles = this.locatorForAll(
        `[data-test-id="${BaseDynamicEventHarness.SECTION_TITLE_TEST_ID}"]`,
    );

    public async getSectionTitles(): Promise<string[]> {
        const titles = await this.locatorSectionTitles();
        return Promise.all(titles.map((title) => title.text()));
    }

    public async getPropertyText(dataTestId: string): Promise<MaybeNull<string>> {
        const property = await this.locatorForOptional(`[data-test-id="${dataTestId}"]`)();
        return property ? property.text() : null;
    }
}
