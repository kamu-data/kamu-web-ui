/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { DatasetFlowProcessCardHarness } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.harness";

export class FlowsHarness extends ComponentHarness {
    public static readonly hostSelector = "app-flows";

    private static readonly EMPTY_FLOW_RUNS_TEST_ID = "empty-flow-runs-block";
    private static readonly INIT_PROGRESS_BAR_TEST_ID = "init-progress-bar";
    private static readonly UPDATE_NOW_LINK_TEST_ID = "update-now-link";

    private readonly locatorEmptyFlowRuns = this.locatorForOptional(
        `[data-test-id="${FlowsHarness.EMPTY_FLOW_RUNS_TEST_ID}"]`,
    );
    private readonly locatorInitProgressBar = this.locatorForOptional(
        `[data-test-id="${FlowsHarness.INIT_PROGRESS_BAR_TEST_ID}"]`,
    );
    private readonly locatorUpdateNowLink = this.locatorForOptional(
        `[data-test-id="${FlowsHarness.UPDATE_NOW_LINK_TEST_ID}"]`,
    );
    private readonly locatorDatasetProcessCard = this.locatorFor(DatasetFlowProcessCardHarness);

    public async isEmptyFlowRunsBlockVisible(): Promise<boolean> {
        const block = await this.locatorEmptyFlowRuns();
        return block !== null;
    }

    public async isInitProgressBarVisible(): Promise<boolean> {
        const progressBar = await this.locatorInitProgressBar();
        return progressBar !== null;
    }

    public async isUpdateNowLinkVisible(): Promise<boolean> {
        const link = await this.locatorUpdateNowLink();
        return link !== null;
    }

    public async clickUpdateNowLink(): Promise<void> {
        const link = await this.locatorUpdateNowLink();
        if (!link) {
            throw new Error("The 'update now' link is not shown");
        }
        await link.click();
    }

    /** The dataset's own process card, shown above the flow runs */
    public getDatasetProcessCard(): Promise<DatasetFlowProcessCardHarness> {
        return this.locatorDatasetProcessCard();
    }
}
