/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import {
    findElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockOlderBlock } from "@api/mock/dataset.mock";

import { mockDerivedOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { CommitNavigatorHarness } from "src/app/dataset-view/additional-components/metadata-component/components/commit-navigator/commit-navigator.harness";
import { MetadataComponent } from "src/app/dataset-view/additional-components/metadata-component/metadata.component";
import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import {
    atOlderCommit,
    mockCommitNeighbours,
    mockLatestDerivedSnapshot,
    mockLatestRootSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.mock";
import {
    CommitStepMode,
    MetadataSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("MetadataComponent", () => {
    let fixture: ComponentFixture<MetadataComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, MetadataComponent, RouterModule],
            providers: [HIGHLIGHT_OPTIONS_PROVIDER, provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();
        fixture = TestBed.createComponent(MetadataComponent);
        setComponentInput(fixture, "activeTab", MetadataTabs.Schema);
    });

    function show(snapshot: MetadataSnapshot, isRoot: boolean): void {
        setComponentInput(fixture, "datasetMetadataTabData", {
            datasetBasics: isRoot ? mockDatasetBasicsRootFragment : mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockDerivedOverviewUpdate,
        });
        setComponentInput(fixture, "commitData", {
            snapshot,
            neighbours: mockCommitNeighbours,
            steps: CommitStepMode.MetadataChanges,
        });
        fixture.detectChanges();
    }

    it("should show the sections a derivative dataset has", () => {
        show(mockLatestDerivedSnapshot, false);

        expect(findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.Transformation}`)).toBeDefined();
        expect(findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.PollingSource}`)).toBeUndefined();
        expect(findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.Watermark}`)).toBeUndefined();
    });

    it("should show the sections a root dataset has", () => {
        show(mockLatestRootSnapshot, true);

        expect(findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.PollingSource}`)).toBeDefined();
        expect(findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.Watermark}`)).toBeDefined();
        expect(findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.Transformation}`)).toBeUndefined();
    });

    it("should keep the shown commit in the section links", () => {
        show(atOlderCommit(mockLatestRootSnapshot), true);

        const link = findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.License}`);
        expect(link?.getAttribute("href")).toEqual(
            `/${mockDatasetBasicsRootFragment.owner.accountName}/${mockDatasetBasicsRootFragment.name}/${DatasetViewTypeEnum.Metadata}/${MetadataTabs.License}?head=${mockOlderBlock.blockHash}`,
        );
    });

    it("should say an older commit has no metadata, without the links to add a source", () => {
        show(
            {
                ...atOlderCommit(mockLatestRootSnapshot),
                schema: null,
                license: null,
                watermark: null,
                pollingSource: null,
                pushSources: [],
            },
            true,
        );

        expect(findElementByDataTestId(fixture, "no-metadata-at-commit")).toBeDefined();
        expect(findElementByDataTestId(fixture, "needs-data-source")).toBeUndefined();
        expect(findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.Schema}`)).toBeUndefined();
    });

    it("should show the license of an older commit that has no source yet", () => {
        show({ ...atOlderCommit(mockLatestRootSnapshot), schema: null, pollingSource: null, pushSources: [] }, true);

        expect(findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.License}`)).toBeDefined();
        expect(findElementByDataTestId(fixture, "no-metadata-at-commit")).toBeUndefined();
        expect(findElementByDataTestId(fixture, "needs-data-source")).toBeUndefined();
    });

    it("should ask for a source at the latest commit, beside the metadata it already has", () => {
        show({ ...mockLatestRootSnapshot, pollingSource: null, pushSources: [] }, true);

        expect(findElementByDataTestId(fixture, "needs-data-source")).toBeDefined();
        expect(findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.License}`)).toBeDefined();
    });

    it("should only ask for a transformation when a derivative dataset has no metadata yet", () => {
        show({ ...mockLatestDerivedSnapshot, schema: null, license: null, watermark: null, transform: null }, false);

        expect(findElementByDataTestId(fixture, "needs-data-source")).toBeDefined();
        expect(findElementByDataTestId(fixture, `metadata-menu-${MetadataTabs.Schema}`)).toBeUndefined();
    });

    it("should show the navigator at the shown commit", async () => {
        show(atOlderCommit(mockLatestRootSnapshot), true);

        const navigator = await TestbedHarnessEnvironment.loader(fixture).getHarness(CommitNavigatorHarness);
        expect(await navigator.isLatest()).toBe(false);
        expect(await navigator.getLabel()).toContain(mockOlderBlock.blockHash.slice(-8));
    });
});
