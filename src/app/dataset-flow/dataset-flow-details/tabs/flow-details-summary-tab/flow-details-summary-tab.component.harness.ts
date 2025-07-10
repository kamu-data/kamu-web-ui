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

    private readonly locatorFlowType = this.locatorFor('[data-test-id="flow-type"]');
    private readonly locatorFlowStatus = this.locatorFor('[data-test-id="flow-status"]');
    private readonly locatorFlowInitiator = this.locatorFor('[data-test-id="flow-initiator"]');
    private readonly locatorFlowInitiatedTime = this.locatorFor('[data-test-id="flow-initiated-time"]');
    private readonly locatorFlowRunningTime = this.locatorFor('[data-test-id="flow-running-time"]');
    private readonly locatorFlowOutcome = this.locatorForOptional('[data-test-id="flow-outcome"]');
    private readonly locatorFlowRetryAttempts = this.locatorForOptional('[data-test-id="flow-retry-attempts"]');
    private readonly locatorFlowFinishedTime = this.locatorForOptional('[data-test-id="flow-finished-time"]');

    /**
     * Gets the flow type text
     */
    public async getFlowType(): Promise<string> {
        const element = await this.locatorFlowType();
        return (await element.text()).trim();
    }

    /**
     * Gets the flow status text
     */
    public async getFlowStatus(): Promise<string> {
        const element = await this.locatorFlowStatus();
        return (await element.text()).trim();
    }

    /**
     * Gets the flow initiator text
     */
    public async getFlowInitiator(): Promise<string> {
        const element = await this.locatorFlowInitiator();
        return (await element.text()).trim();
    }

    /**
     * Gets the flow initiated time text
     */
    public async getFlowInitiatedTime(): Promise<string> {
        const element = await this.locatorFlowInitiatedTime();
        return (await element.text()).trim();
    }

    /**
     * Gets the flow running time text
     */
    public async getFlowRunningTime(): Promise<string> {
        const element = await this.locatorFlowRunningTime();
        return (await element.text()).trim();
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

        const text = (await element.text()).trim();
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
        return element ? (await element.text()).trim() : null;
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
        return element ? (await element.text()).trim() : null;
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
        const flowRunningTime = await this.getFlowRunningTime();

        return !!(flowType && flowStatus && flowInitiator && flowInitiatedTime && flowRunningTime);
    }
}
