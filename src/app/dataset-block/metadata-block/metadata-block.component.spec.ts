/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSlideToggleHarness } from "@angular/material/slide-toggle/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";

import { of, throwError } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { MetadataEventType } from "@api/kamu.graphql.interface";
import { mockMetadataBlockByHash } from "@api/mock/dataset.mock";

import { BlockNavigationHarness } from "src/app/dataset-block/metadata-block/components/block-navigation/block-navigation.harness";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { MetadataBlockComponent } from "src/app/dataset-block/metadata-block/metadata-block.component";
import {
    MOCK_BLOCK_PAGE_DATASET_INFO,
    MOCK_BLOCK_PAGE_HASH,
} from "src/app/dataset-block/metadata-block/metadata-block.mock";
import { mockHistoryUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("MetadataBlockComponent", () => {
    let component: MetadataBlockComponent;
    let fixture: ComponentFixture<MetadataBlockComponent>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, MetadataBlockComponent, MatSlideToggleModule],
            providers: [
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of(
                            convertToParamMap({
                                ...MOCK_BLOCK_PAGE_DATASET_INFO,
                                blockHash: MOCK_BLOCK_PAGE_HASH,
                            }),
                        ),
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return MOCK_BLOCK_PAGE_DATASET_INFO.accountName;
                                        case "datasetName":
                                            return MOCK_BLOCK_PAGE_DATASET_INFO.datasetName;
                                    }
                                },
                            },
                        },
                    },
                },
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(MetadataBlockComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        setComponentInput(fixture, "blockHash", MOCK_BLOCK_PAGE_HASH);
        setComponentInput(fixture, "metadata", {
            block: mockMetadataBlockByHash,
            blockAsYaml: "test yaml",
            downstreamsCount: 0,
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check emit value for yaml view", async () => {
        const matToggle = await loader.getHarness(
            MatSlideToggleHarness.with({ selector: '[data-test-id="yaml-toggle"]' }),
        );

        const changeToggleSpy = vi.spyOn(component, "toggleYamlView").mockImplementation(() => {});

        await matToggle.toggle();

        expect(changeToggleSpy).toHaveBeenCalledTimes(1);
    });

    it("should request the page and filter the URL holds", () => {
        const getDatasetHistorySpy = vi
            .spyOn(TestBed.inject(DatasetService), "getDatasetHistory")
            .mockReturnValue(of(mockHistoryUpdate));

        setComponentInput(fixture, "eventTypes", "SetTransform,Unknown,Seed");
        setComponentInput(fixture, "hashPrefix", " f1620ab ");
        setComponentInput(fixture, "page", "3");
        fixture.detectChanges();

        expect(getDatasetHistorySpy).toHaveBeenLastCalledWith(MOCK_BLOCK_PAGE_DATASET_INFO, 10, 2, {
            eventTypes: [MetadataEventType.SetTransform, MetadataEventType.Seed],
            blockHashPrefix: "f1620ab",
        });
    });

    it("should load the next page after the request for a page fails", async () => {
        const getDatasetHistorySpy = vi.spyOn(TestBed.inject(DatasetService), "getDatasetHistory");
        getDatasetHistorySpy.mockReturnValueOnce(throwError(() => new Error("Server unreachable")));
        getDatasetHistorySpy.mockReturnValue(of(mockHistoryUpdate));

        setComponentInput(fixture, "page", "2");
        fixture.detectChanges();
        expect(await loader.getHarnessOrNull(BlockNavigationHarness)).toBeNull();

        setComponentInput(fixture, "page", "3");
        fixture.detectChanges();
        const blockNavigation = await loader.getHarness(BlockNavigationHarness);
        expect(await blockNavigation.getBlockHashes()).toHaveLength(mockHistoryUpdate.history.length);
        expect(getDatasetHistorySpy).toHaveBeenLastCalledWith(MOCK_BLOCK_PAGE_DATASET_INFO, 10, 2, {});
    });

    it("should not send a hash prefix the backend can't parse", () => {
        const getDatasetHistorySpy = vi
            .spyOn(TestBed.inject(DatasetService), "getDatasetHistory")
            .mockReturnValue(of(mockHistoryUpdate));

        setComponentInput(fixture, "eventTypes", "Seed");
        setComponentInput(fixture, "hashPrefix", "xyz");
        fixture.detectChanges();

        expect(getDatasetHistorySpy).toHaveBeenLastCalledWith(MOCK_BLOCK_PAGE_DATASET_INFO, 10, 0, {
            eventTypes: [MetadataEventType.Seed],
        });
    });

    it("should open the first page of a new filter, and keep the filter when paging", () => {
        const navigateSpy = stubMethod(TestBed.inject(NavigationService), "navigateToMetadataBlock");
        const filter = { eventTypes: [SupportedEvents.SetTransform], hashPrefix: "" };

        component.onFilterChange(filter);
        expect(navigateSpy).toHaveBeenLastCalledWith({
            ...MOCK_BLOCK_PAGE_DATASET_INFO,
            blockHash: MOCK_BLOCK_PAGE_HASH,
            blockListFilter: filter,
            blockListPage: 1,
        });

        setComponentInput(fixture, "eventTypes", "SetTransform");
        component.onPageChange(3);
        expect(navigateSpy).toHaveBeenLastCalledWith({
            ...MOCK_BLOCK_PAGE_DATASET_INFO,
            blockHash: MOCK_BLOCK_PAGE_HASH,
            blockListFilter: filter,
            blockListPage: 3,
        });
    });
});
