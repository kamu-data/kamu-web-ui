/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import {
    mockMetadataDerivedUpdate,
    mockMetadataRootPushSourceUpdate,
    mockMetadataRootUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "../data-tabs.mock";
import { MetadataComponent } from "./metadata.component";
import { ChangeDetectionStrategy } from "@angular/core";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { BlockRowDataComponent } from "src/app/common/components/block-row-data/block-row-data.component";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { HIGHLIGHT_OPTIONS } from "ngx-highlightjs";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";

describe("MetadataComponent", () => {
    let component: MetadataComponent;
    let fixture: ComponentFixture<MetadataComponent>;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NgbTooltipModule,
                MatIconModule,
                SharedTestModule,
                HttpClientTestingModule,
                MetadataComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
            providers: [
                {
                    provide: HIGHLIGHT_OPTIONS,
                    useValue: {
                        coreLibraryLoader: () => import("highlight.js/lib/core"),
                        languages: {
                            sql: () => import("highlight.js/lib/languages/sql"),
                            yaml: () => import("highlight.js/lib/languages/yaml"),
                        },
                    },
                },
            ],
        })
            .overrideComponent(MetadataComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        registerMatSvgIcons();

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        datasetSubsService.emitMetadataSchemaChanged(mockMetadataDerivedUpdate);

        navigationService = TestBed.inject(NavigationService);

        fixture = TestBed.createComponent(MetadataComponent);
        component = fixture.componentInstance;
        component.datasetMetadataTabData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: {
                schema: mockMetadataDerivedUpdate.schema,
                content: mockOverviewDataUpdate.content,
                overview: structuredClone(mockOverviewDataUpdateNullable.overview),
                size: mockOverviewDataUpdate.size,
            } as OverviewUpdate,
        };
        // component.datasetBasics = mockDatasetBasicsDerivedFragment;
        // component.datasetPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #ngOnInit and associated properties for derived dataset", () => {
        // Derived dataset mocked by default
        expect(component.datasetMetadataTabData.datasetBasics.kind).toEqual(DatasetKind.Derivative);

        expect(component.currentState).toBeDefined();

        expect(component.currentLicense).toBeTruthy();
        expect(component.currentTransform).toBeTruthy();
        expect(component.currentWatermark).toBeTruthy();
        expect(component.currentPollingSource).toBeFalsy();
    });

    it("should check #ngOnInit and associated properties for root dataset", () => {
        component.currentState = mockMetadataRootUpdate;
        component.datasetMetadataTabData.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();

        expect(component.currentLicense).toBeTruthy();
        expect(component.currentTransform).toBeFalsy();
        expect(component.currentWatermark).toBeTruthy();
        expect(component.currentPollingSource).toBeTruthy();
    });

    it("should check default values for properties and permissions when no state is defined yet", () => {
        component.currentState = undefined;
        fixture.detectChanges();

        expect(component.currentPage).toEqual(1);
        expect(component.totalPages).toEqual(1);
        expect(component.latestBlockHash).toEqual("");
        expect(component.latestBlockSystemTime).toEqual("");
        expect(component.currentLicense).toBeUndefined();
        expect(component.currentPollingSource).toBeUndefined();
        expect(component.currentTransform).toBeUndefined();
        expect(component.currentWatermark).toBeUndefined();

        expect(component.canEditSetPollingSource).toBeFalse();
        expect(component.canEditSetTransform).toBeFalse();
        expect(component.canEditAddPushSource).toBeFalse();
    });

    it("should check page change", () => {
        const pageNumber = 1;
        const pageChangeEmitSpy = spyOn(component.pageChangeEmit, "emit");
        component.onPageChange(pageNumber);
        expect(pageChangeEmitSpy).toHaveBeenCalledWith(pageNumber);
    });

    describe("SetPollingSource", () => {
        it("should not be possible to edit SetPollingSource for derivative dataset", () => {
            // Derivative dataset by default
            expect(component.datasetMetadataTabData.datasetBasics.kind).toEqual(DatasetKind.Derivative);
            expect(component.canEditSetPollingSource).toEqual(false);
        });

        it("should be possible to edit SetPollingSource for root dataset with full permissions", () => {
            // Full permissions by default
            component.datasetMetadataTabData = {
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                overviewUpdate: {
                    schema: mockMetadataDerivedUpdate.schema,
                    content: mockOverviewDataUpdate.content,
                    overview: structuredClone(mockOverviewDataUpdate.overview),
                    size: mockOverviewDataUpdate.size,
                } as OverviewUpdate,
            };
            component.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit = true;
            component.currentState = mockMetadataRootUpdate;

            expect(component.canEditSetPollingSource).toEqual(true);
        });

        it("should not be possible to edit SetPollingSource for root dataset without commit permissions", () => {
            component.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit = false;
            component.datasetMetadataTabData.datasetBasics = mockDatasetBasicsRootFragment;
            component.currentState = mockMetadataRootUpdate;
            fixture.detectChanges();

            expect(component.canEditSetPollingSource).toEqual(false);
        });

        it("should not be possible to edit SetPollingSource for root dataset if no source is defined yet", () => {
            component.datasetMetadataTabData.datasetBasics = mockDatasetBasicsRootFragment;
            component.currentState = structuredClone(mockMetadataRootUpdate);
            component.currentState.metadataSummary.metadata.currentPollingSource = undefined;
            fixture.detectChanges();

            expect(component.canEditSetPollingSource).toEqual(false);
        });

        it("should check navigate to edit SetPollingSource event", () => {
            const navigateToAddPollingSourceSpy = spyOn(navigationService, "navigateToAddPollingSource");
            component.datasetMetadataTabData.datasetBasics = mockDatasetBasicsRootFragment;
            component.currentState = mockMetadataRootUpdate;
            fixture.detectChanges();

            component.navigateToEditPollingSource();
            expect(navigateToAddPollingSourceSpy).toHaveBeenCalledWith({
                accountName: mockDatasetBasicsRootFragment.owner.accountName,
                datasetName: mockDatasetBasicsRootFragment.name,
            });
        });
    });

    describe("AddPushSource", () => {
        it("should be possible to edit AddPushSourceSource for root dataset with full permissions", () => {
            // Full permissions by default
            component.datasetMetadataTabData = {
                datasetBasics: structuredClone(mockDatasetBasicsRootFragment),
                datasetPermissions: structuredClone(mockFullPowerDatasetPermissionsFragment),
                overviewUpdate: {
                    schema: mockMetadataDerivedUpdate.schema,
                    content: structuredClone(mockOverviewDataUpdate).content,
                    overview: structuredClone(mockOverviewDataUpdate).overview,
                    size: structuredClone(mockOverviewDataUpdate).size,
                } as OverviewUpdate,
            };
            component.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit = true;
            component.currentState = structuredClone(mockMetadataRootPushSourceUpdate);

            expect(component.canEditAddPushSource).toEqual(true);
        });

        it("should not be possible to edit AddPushSourceSource for root dataset without commit permissions", () => {
            component.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit = false;
            component.datasetMetadataTabData.datasetBasics = mockDatasetBasicsRootFragment;
            component.currentState = mockMetadataRootPushSourceUpdate;
            fixture.detectChanges();

            expect(component.canEditAddPushSource).toEqual(false);
        });

        it("should check navigate to edit AddPushSource event with source name", () => {
            const navigateToAddPollingSourceSpy = spyOn(navigationService, "navigateToAddPushSource");
            component.datasetMetadataTabData.datasetBasics = mockDatasetBasicsRootFragment;
            component.currentState = mockMetadataRootPushSourceUpdate;
            const sourceName = "mockName";
            fixture.detectChanges();

            component.navigateToEditAddPushSource(sourceName);
            expect(navigateToAddPollingSourceSpy).toHaveBeenCalledWith(
                {
                    accountName: mockDatasetBasicsRootFragment.owner.accountName,
                    datasetName: mockDatasetBasicsRootFragment.name,
                },
                sourceName,
            );
        });
    });

    // describe("SetTransform", () => {
    //     it("should be possible to edit SetTransform for derivative dataset with full permissions", () => {
    //         // Full permissions by default
    //         // Derivative dataset by default
    //         component.datasetMetadataTabData = {
    //             datasetBasics: structuredClone(mockDatasetBasicsDerivedFragment),
    //             datasetPermissions: structuredClone(mockFullPowerDatasetPermissionsFragment),
    //             overviewUpdate: {
    //                 schema: mockMetadataDerivedUpdate.schema,
    //                 content: mockOverviewDataUpdate.content,
    //                 overview: structuredClone(mockOverviewDataUpdateNullable.overview),
    //                 size: mockOverviewDataUpdate.size,
    //             } as OverviewUpdate,
    //         };
    //         component.currentState = mockMetadataDerivedUpdate;

    //         expect(component.canEditSetTransform).toEqual(true);
    //     });

    //     it("should not be possible to edit SetTransform for root dataset", () => {
    //         component.datasetMetadataTabData.datasetBasics = mockDatasetBasicsRootFragment;
    //         component.currentState = mockMetadataRootUpdate;
    //         fixture.detectChanges();

    //         expect(component.canEditSetTransform).toEqual(false);
    //     });

    //     it("should not be possible to edit SetTransform for derived dataset without commit permissions", () => {
    //         component.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit = false;
    //         fixture.detectChanges();

    //         expect(component.canEditSetTransform).toEqual(false);
    //     });

    //     it("should not be possible to edit SetTransform for derived dataset if no transform is defined yet", () => {
    //         component.currentState = structuredClone(mockMetadataDerivedUpdate);
    //         component.currentState.metadataSummary.metadata.currentTransform = undefined;
    //         fixture.detectChanges();

    //         expect(component.canEditSetTransform).toEqual(false);
    //     });

    //     it("should check navigate to edit SetTransform event", () => {
    //         const navigateToSetTransformSpy = spyOn(navigationService, "navigateToSetTransform");
    //         component.navigateToEditSetTransform();
    //         expect(navigateToSetTransformSpy).toHaveBeenCalledWith({
    //             accountName: mockDatasetBasicsDerivedFragment.owner.accountName,
    //             datasetName: mockDatasetBasicsDerivedFragment.name,
    //         });
    //     });
    // });
});
