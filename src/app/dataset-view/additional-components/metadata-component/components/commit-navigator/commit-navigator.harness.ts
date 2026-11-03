/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { MaybeNull } from "@interface/app.types";

export class CommitNavigatorHarness extends ComponentHarness {
    public static readonly hostSelector = "app-commit-navigator";

    private static readonly OLDER_LINK_TEST_ID = "older-commit-link";
    private static readonly NEWER_LINK_TEST_ID = "newer-commit-link";
    private static readonly LABEL_TEST_ID = "commit-label";
    private static readonly HASH_LINK_TEST_ID = "commit-hash-link";
    private static readonly LATEST_BADGE_TEST_ID = "latest-commit-badge";
    private static readonly LATEST_LINK_TEST_ID = "latest-commit-link";
    private static readonly STEP_MODE_TEST_ID = "commit-step-mode";

    private readonly locatorOlderLink = this.locatorForOptional(
        `[data-test-id="${CommitNavigatorHarness.OLDER_LINK_TEST_ID}"]`,
    );
    private readonly locatorNewerLink = this.locatorForOptional(
        `[data-test-id="${CommitNavigatorHarness.NEWER_LINK_TEST_ID}"]`,
    );
    private readonly locatorLabel = this.locatorFor(`[data-test-id="${CommitNavigatorHarness.LABEL_TEST_ID}"]`);
    private readonly locatorHashLink = this.locatorFor(`[data-test-id="${CommitNavigatorHarness.HASH_LINK_TEST_ID}"]`);
    private readonly locatorLatestBadge = this.locatorForOptional(
        `[data-test-id="${CommitNavigatorHarness.LATEST_BADGE_TEST_ID}"]`,
    );
    private readonly locatorLatestLink = this.locatorForOptional(
        `[data-test-id="${CommitNavigatorHarness.LATEST_LINK_TEST_ID}"]`,
    );
    private readonly locatorStepMode = this.locatorFor(`[data-test-id="${CommitNavigatorHarness.STEP_MODE_TEST_ID}"]`);

    /** The address the older-commit arrow leads to, `null` when it is disabled */
    public async getOlderCommitUrl(): Promise<MaybeNull<string>> {
        const link = await this.locatorOlderLink();
        return link ? link.getAttribute("href") : null;
    }

    /** The address the newer-commit arrow leads to, `null` when it is disabled */
    public async getNewerCommitUrl(): Promise<MaybeNull<string>> {
        const link = await this.locatorNewerLink();
        return link ? link.getAttribute("href") : null;
    }

    public async getLabel(): Promise<string> {
        const label = await this.locatorLabel();
        const text = await label.text();
        return text.trim();
    }

    public async getBlockUrl(): Promise<MaybeNull<string>> {
        const link = await this.locatorHashLink();
        return link.getAttribute("href");
    }

    public async isLatest(): Promise<boolean> {
        const badge = await this.locatorLatestBadge();
        return badge !== null;
    }

    /** The address of the link back to the latest commit, `null` when the latest commit is shown */
    public async getLatestCommitUrl(): Promise<MaybeNull<string>> {
        const link = await this.locatorLatestLink();
        return link ? link.getAttribute("href") : null;
    }

    /** The label of the selected step mode */
    public async getStepMode(): Promise<string> {
        const select = await this.locatorStepMode();
        const index = await select.getProperty<number>("selectedIndex");
        const labels = await this.getStepModeLabels();
        return labels[index];
    }

    public async selectStepMode(label: string): Promise<void> {
        const select = await this.locatorStepMode();
        const labels = await this.getStepModeLabels();
        await select.selectOptions(labels.indexOf(label));
    }

    private async getStepModeLabels(): Promise<string[]> {
        const options = await this.locatorForAll(
            `[data-test-id="${CommitNavigatorHarness.STEP_MODE_TEST_ID}"] option`,
        )();
        return Promise.all(options.map(async (option) => (await option.text()).trim()));
    }
}
