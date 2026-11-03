/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { mockOlderBlock } from "@api/mock/dataset.mock";

import { CommitNavigatorComponent } from "src/app/dataset-view/additional-components/metadata-component/components/commit-navigator/commit-navigator.component";
import { CommitNavigatorHarness } from "src/app/dataset-view/additional-components/metadata-component/components/commit-navigator/commit-navigator.harness";
import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import {
    atOlderCommit,
    mockLatestRootCommitData,
    mockLatestRootSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.mock";
import {
    CommitStepMode,
    MetadataCommitData,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("CommitNavigatorComponent", () => {
    const DATASET_URL = `/${mockDatasetBasicsRootFragment.owner.accountName}/${mockDatasetBasicsRootFragment.name}`;
    const LICENSE_URL = `${DATASET_URL}/${DatasetViewTypeEnum.Metadata}/${MetadataTabs.License}`;
    let fixture: ComponentFixture<CommitNavigatorComponent>;
    let harness: CommitNavigatorHarness;

    const olderCommitData: MetadataCommitData = {
        snapshot: atOlderCommit(mockLatestRootSnapshot),
        neighbours: { older: null, newer: {} },
        steps: CommitStepMode.AllBlocks,
    };

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [CommitNavigatorComponent],
            providers: [provideRouter([])],
        });
        registerMatSvgIcons();
        fixture = TestBed.createComponent(CommitNavigatorComponent);
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
        setComponentInput(fixture, "section", MetadataTabs.License);
        setComponentInput(fixture, "commitData", mockLatestRootCommitData);
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, CommitNavigatorHarness);
    });

    it("should show the latest commit with a step to the older one", async () => {
        const latestBlock = mockLatestRootSnapshot.block;

        expect(await harness.isLatest()).toBe(true);
        expect(await harness.getLabel()).toContain(latestBlock.blockHash.slice(-8));
        expect(await harness.getBlockUrl()).toEqual(
            `${DATASET_URL}/${ProjectLinks.URL_BLOCK}/${latestBlock.blockHash}`,
        );
        expect(await harness.getOlderCommitUrl()).toEqual(`${LICENSE_URL}?head=${mockOlderBlock.blockHash}`);
        expect(await harness.getNewerCommitUrl()).toBeNull();
        expect(await harness.getLatestCommitUrl()).toBeNull();
        expect(await harness.getStepMode()).toEqual("Metadata changes");
    });

    it("should lead an older commit back to the latest one, keeping the step mode", async () => {
        setComponentInput(fixture, "commitData", olderCommitData);

        expect(await harness.isLatest()).toBe(false);
        expect(await harness.getLabel()).toContain(mockOlderBlock.blockHash.slice(-8));
        expect(await harness.getOlderCommitUrl()).toBeNull();
        expect(await harness.getNewerCommitUrl()).toEqual(`${LICENSE_URL}?steps=all`);
        expect(await harness.getLatestCommitUrl()).toEqual(`${LICENSE_URL}?steps=all`);
        expect(await harness.getStepMode()).toEqual("All blocks");
    });

    it("should switch the step mode at the same commit", async () => {
        const navigateSpy = stubMethod(TestBed.inject(NavigationService), "navigateToDatasetView");
        setComponentInput(fixture, "commitData", olderCommitData);

        await harness.selectStepMode("Metadata changes");

        expect(navigateSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
            tab: DatasetViewTypeEnum.Metadata,
            section: MetadataTabs.License,
            head: mockOlderBlock.blockHash,
            steps: CommitStepMode.MetadataChanges,
        });
    });
});
