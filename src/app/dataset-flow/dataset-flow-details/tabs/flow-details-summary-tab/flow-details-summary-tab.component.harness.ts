/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

/**
 * Test harness for FlowDetailsSummaryTabComponent that provides a clean API
 * for accessing and testing component elements without direct DOM manipulation.
 */
export class FlowDetailsSummaryTabHarness extends ComponentHarness {
    public static readonly hostSelector = ".container"; // Use a more generic selector since we're testing within the component

    private static readonly FLOW_TYPE_TEST_ID = "flow-type";
    private static readonly FLOW_STATUS_TEST_ID = "flow-status";
    private static readonly FLOW_INITIATOR_TEST_ID = "flow-initiator";
    private static readonly FLOW_INITIATED_TIME_TEST_ID = "flow-initiated-time";
    private static readonly FLOW_RUN_DURATION_TEST_ID = "flow-run-duration";
    private static readonly FLOW_TOTAL_TIME_TEST_ID = "flow-total-time";
    private static readonly FLOW_OUTCOME_TEST_ID = "flow-outcome";
    private static readonly FLOW_RETRY_ATTEMPTS_TEST_ID = "flow-retry-attempts";
    private static readonly FLOW_FINISHED_TIME_TEST_ID = "flow-finished-time";

    private readonly locatorFlowType = this.locatorFor(
        `[data-test-id="${FlowDetailsSummaryTabHarness.FLOW_TYPE_TEST_ID}"]`,
    );
    private readonly locatorFlowStatus = this.locatorFor(
        `[data-test-id="${FlowDetailsSummaryTabHarness.FLOW_STATUS_TEST_ID}"]`,
    );
    private readonly locatorFlowInitiator = this.locatorFor(
        `[data-test-id="${FlowDetailsSummaryTabHarness.FLOW_INITIATOR_TEST_ID}"]`,
    );
    private readonly locatorFlowInitiatedTime = this.locatorFor(
        `[data-test-id="${FlowDetailsSummaryTabHarness.FLOW_INITIATED_TIME_TEST_ID}"]`,
    );
    private readonly locatorFlowRunDuration = this.locatorFor(
        `[data-test-id="${FlowDetailsSummaryTabHarness.FLOW_RUN_DURATION_TEST_ID}"]`,
    );
    private readonly locatorFlowTotalTime = this.locatorFor(
        `[data-test-id="${FlowDetailsSummaryTabHarness.FLOW_TOTAL_TIME_TEST_ID}"]`,
    );
    private readonly locatorFlowOutcome = this.locatorForOptional(
        `[data-test-id="${FlowDetailsSummaryTabHarness.FLOW_OUTCOME_TEST_ID}"]`,
    );
    private readonly locatorFlowRetryAttempts = this.locatorForOptional(
        `[data-test-id="${FlowDetailsSummaryTabHarness.FLOW_RETRY_ATTEMPTS_TEST_ID}"]`,
    );
    private readonly locatorFlowFinishedTime = this.locatorForOptional(
        `[data-test-id="${FlowDetailsSummaryTabHarness.FLOW_FINISHED_TIME_TEST_ID}"]`,
    );

    /**
     * Gets the flow type text
     */
    public async getFlowType(): Promise<string> {
        const element = await this.locatorFlowType();
        const text = await element.text();
        return text.trim();
    }

    /**
     * Gets the flow status text
     */
    public async getFlowStatus(): Promise<string> {
        const element = await this.locatorFlowStatus();
        const text = await element.text();
        return text.trim();
    }

    /**
     * Gets the flow initiator text
     */
    public async getFlowInitiator(): Promise<string> {
        const element = await this.locatorFlowInitiator();
        const text = await element.text();
        return text.trim();
    }

    /**
     * Gets the flow initiated time text
     */
    public async getFlowInitiatedTime(): Promise<string> {
        const element = await this.locatorFlowInitiatedTime();
        const text = await element.text();
        return text.trim();
    }

    /**
     * Gets the flow run duration text
     */
    public async getFlowRunDuration(): Promise<string> {
        const element = await this.locatorFlowRunDuration();
        const text = await element.text();
        return text.trim();
    }

    /**
     * Gets the flow totaltext
     */
    public async getFlowTotalTime(): Promise<string> {
        const element = await this.locatorFlowTotalTime();
        const text = await element.text();
        return text.trim();
    }

    /**
     * Gets outcome information
     * @returns Object with outcome text and CSS classes, or null if outcome element doesn't exist
     */
    public async getOutcome(): Promise<{ text: string; cssClasses: string[] } | null> {
        const element = await this.locatorFlowOutcome();
        if (!element) {
            return null;
        }

        const rawText = await element.text();
        const text = rawText.trim();
        const cssClasses = await element.getAttribute("class");

        return {
            text,
            cssClasses: cssClasses ? cssClasses.split(" ").filter((cls) => cls.length > 0) : [],
        };
    }

    /**
     * Checks if outcome element is rendered
     */
    public async hasOutcomeElement(): Promise<boolean> {
        const element = await this.locatorFlowOutcome();
        return element !== null;
    }

    /**
     * Gets retry attempts information
     * @returns The retry attempts text or null if retry section doesn't exist
     */
    public async getRetryAttempts(): Promise<string | null> {
        const element = await this.locatorFlowRetryAttempts();
        if (!element) {
            return null;
        }
        const text = await element.text();
        return text.trim();
    }

    /**
     * Checks if retry policy section is rendered
     */
    public async hasRetryPolicySection(): Promise<boolean> {
        const element = await this.locatorFlowRetryAttempts();
        return element !== null;
    }

    /**
     * Gets finished time information
     * @returns The finished time text or null if finished time element doesn't exist
     */
    public async getFinishedTime(): Promise<string | null> {
        const element = await this.locatorFlowFinishedTime();
        if (!element) {
            return null;
        }
        const text = await element.text();
        return text.trim();
    }

    /**
     * Checks if finished time element is rendered
     */
    public async hasFinishedTimeElement(): Promise<boolean> {
        const element = await this.locatorFlowFinishedTime();
        return element !== null;
    }

    /**
     * Checks if a specific outcome CSS class is present
     */
    public async hasOutcomeCssClass(className: string): Promise<boolean> {
        const outcome = await this.getOutcome();
        return outcome ? outcome.cssClasses.includes(className) : false;
    }

    /**
     * Validates that all basic fields are rendered with content
     */
    public async hasAllBasicFields(): Promise<boolean> {
        const flowType = await this.getFlowType();
        const flowStatus = await this.getFlowStatus();
        const flowInitiator = await this.getFlowInitiator();
        const flowInitiatedTime = await this.getFlowInitiatedTime();
        const flowRunDuration = await this.getFlowRunDuration();
        const flowTotalTime = await this.getFlowTotalTime();

        return !!(flowType && flowStatus && flowInitiator && flowInitiatedTime && flowRunDuration && flowTotalTime);
    }
}
