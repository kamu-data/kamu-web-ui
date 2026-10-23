/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { MaybeNull } from "@interface/app.types";

import { LineageGraphNodeKind } from "src/app/dataset-view/additional-components/lineage-component/lineage-model";

export interface LineageSidePanelDetails {
    avatarUrl: MaybeNull<string>;
    dataset: string;
    access: string;
    kind: string;
    size: string;
    records: string;
    license: string;
    created: string;
    updated: string;
    /** `null` when the panel says the dataset has no watermark */
    watermark: MaybeNull<string>;
}

export class LineageGraphHarness extends ComponentHarness {
    public static readonly hostSelector = "app-lineage-graph";

    private static readonly NODE_TEST_ID_PREFIX = "lineage-node-";
    private static readonly PRIVATE_ICON_TEST_ID_PREFIX = "lineage-private-icon-";
    private static readonly INFO_BUTTON_TEST_ID = "info-button";
    private static readonly SIDE_PANEL_TEST_ID = "side-panel";
    private static readonly SIDE_PANEL_AVATAR_TEST_ID = "side-panel-avatar";
    private static readonly SIDE_PANEL_DATASET_TEST_ID = "side-panel-dataset";
    private static readonly SIDE_PANEL_ACCESS_TEST_ID = "side-panel-access";
    private static readonly SIDE_PANEL_KIND_TEST_ID = "side-panel-dataset-kind";
    private static readonly SIDE_PANEL_SIZE_TEST_ID = "side-panel-dataset-size";
    private static readonly SIDE_PANEL_RECORDS_TEST_ID = "side-panel-dataset-records";
    private static readonly SIDE_PANEL_LICENSE_TEST_ID = "side-panel-dataset-license";
    private static readonly SIDE_PANEL_CREATED_TEST_ID = "side-panel-dataset-created";
    private static readonly SIDE_PANEL_UPDATED_TEST_ID = "side-panel-dataset-updated";
    private static readonly SIDE_PANEL_WATERMARK_TEST_ID = "side-panel-dataset-watermark";
    private static readonly SIDE_PANEL_NO_WATERMARK_TEST_ID = "side-panel-no-watermark";

    private readonly locatorInfoButton = this.locatorFor(this.byTestId(LineageGraphHarness.INFO_BUTTON_TEST_ID));
    private readonly locatorSidePanel = this.locatorForOptional(this.byTestId(LineageGraphHarness.SIDE_PANEL_TEST_ID));
    private readonly locatorSidePanelAvatar = this.locatorFor(
        this.byTestId(LineageGraphHarness.SIDE_PANEL_AVATAR_TEST_ID),
    );
    private readonly locatorSidePanelWatermark = this.locatorForOptional(
        this.byTestId(LineageGraphHarness.SIDE_PANEL_WATERMARK_TEST_ID),
    );
    private readonly locatorSidePanelNoWatermark = this.locatorForOptional(
        this.byTestId(LineageGraphHarness.SIDE_PANEL_NO_WATERMARK_TEST_ID),
    );

    public async hasNode(kind: LineageGraphNodeKind, label: string): Promise<boolean> {
        const node = await this.locatorForOptional(this.nodeSelector(kind, label))();
        return node !== null;
    }

    public async clickNode(kind: LineageGraphNodeKind, label: string): Promise<void> {
        const node = await this.locatorFor(this.nodeSelector(kind, label))();
        await node.click();
    }

    public async hasPrivateIcon(label: string): Promise<boolean> {
        const icon = await this.locatorForOptional(
            this.byTestId(`${LineageGraphHarness.PRIVATE_ICON_TEST_ID_PREFIX}${label}`),
        )();
        return icon !== null;
    }

    public async toggleSidePanel(): Promise<void> {
        const button = await this.locatorInfoButton();
        await button.click();
    }

    public async isSidePanelShown(): Promise<boolean> {
        const panel = await this.locatorSidePanel();
        return panel !== null;
    }

    public async getSidePanelDetails(): Promise<LineageSidePanelDetails> {
        const avatar = await this.locatorSidePanelAvatar();
        const watermark = await this.locatorSidePanelWatermark();
        const noWatermark = await this.locatorSidePanelNoWatermark();
        if (!watermark && !noWatermark) {
            throw new Error("The side panel shows neither a watermark nor its absence");
        }
        return {
            avatarUrl: await avatar.getProperty<string>("src"),
            dataset: await this.textOf(LineageGraphHarness.SIDE_PANEL_DATASET_TEST_ID),
            access: await this.textOf(LineageGraphHarness.SIDE_PANEL_ACCESS_TEST_ID),
            kind: await this.textOf(LineageGraphHarness.SIDE_PANEL_KIND_TEST_ID),
            size: await this.textOf(LineageGraphHarness.SIDE_PANEL_SIZE_TEST_ID),
            records: await this.textOf(LineageGraphHarness.SIDE_PANEL_RECORDS_TEST_ID),
            license: await this.textOf(LineageGraphHarness.SIDE_PANEL_LICENSE_TEST_ID),
            created: await this.textOf(LineageGraphHarness.SIDE_PANEL_CREATED_TEST_ID),
            updated: await this.textOf(LineageGraphHarness.SIDE_PANEL_UPDATED_TEST_ID),
            watermark: watermark ? (await watermark.text()).trim() : null,
        };
    }

    private async textOf(testId: string): Promise<string> {
        const element = await this.locatorFor(this.byTestId(testId))();
        const text = await element.text();
        return text.trim();
    }

    private nodeSelector(kind: LineageGraphNodeKind, label: string): string {
        return this.byTestId(`${LineageGraphHarness.NODE_TEST_ID_PREFIX}${kind}-${label}`);
    }

    private byTestId(testId: string): string {
        return `[data-test-id="${testId}"]`;
    }
}
