/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ReactiveFormsModule } from "@angular/forms";
import { ApolloModule } from "apollo-angular";
import { Apollo } from "apollo-angular";
import {
    mockDatasetBasicsDerivedFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockPublicDatasetVisibility,
} from "../../../search/mock.data";
import { mockMetadataDerivedUpdate, mockOverviewDataUpdate } from "../data-tabs.mock";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { OverviewComponent } from "./overview.component";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { DatasetCurrentInfoFragment, DatasetKind, DatasetOverviewFragment } from "src/app/api/kamu.graphql.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { first } from "rxjs/operators";
import { NgbModal, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatChipsModule } from "@angular/material/chips";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { OverviewHistorySummaryHeaderComponent } from "src/app/dataset-view/additional-components/overview-component/components/overview-history-summary-header/overview-history-summary-header.component";
import { ReadmeSectionComponent } from "./components/readme-section/readme-section.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { DisplayTimeComponent } from "src/app/common/components/display-time/display-time.component";
import { DisplayHashComponent } from "src/app/common/components/display-hash/display-hash.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";
import { DynamicTableComponent } from "src/app/common/components/dynamic-table/dynamic-table.component";
import { MatTableModule } from "@angular/material/table";
import { RouterTestingModule } from "@angular/router/testing";
import { mockSetLicense } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { ChangeDetectionStrategy, SecurityContext } from "@angular/core";
import { MarkdownModule } from "ngx-markdown";
import { HttpClient } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { DatasetFlowsService } from "../flows-component/services/dataset-flows.service";
import { of } from "rxjs";
import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    registerMatSvgIcons,
} from "src/app/common/helpers/base-test.helpers.spec";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import AppValues from "src/app/common/values/app.values";
import { RouterModule } from "@angular/router";
import { DatasetCollaborationsService } from "../dataset-settings-component/tabs/access/dataset-settings-access-tab/dataset-collaborations.service";

describe("OverviewComponent", () => {
    let component: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let modalService: NgbModal;
    let datasetFlowsService: DatasetFlowsService;
    let loggedUserService: LoggedUserService;
    let datasetCollaborationsService: DatasetCollaborationsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                OverviewComponent,
                OverviewHistorySummaryHeaderComponent,
                ReadmeSectionComponent,
                DisplayTimeComponent,
                DisplayHashComponent,
                DynamicTableComponent,
            ],
            imports: [
                ApolloModule,
                DisplaySizeModule,
                HttpClientTestingModule,
                MarkdownModule.forRoot({
                    loader: HttpClient,
                    sanitize: SecurityContext.NONE,
                }),
                MatChipsModule,
                MatTableModule,
                NgbTooltipModule,
                OwlDateTimeModule,
                OwlNativeDateTimeModule,
                OwlMomentDateTimeModule,
                ReactiveFormsModule,
                RouterTestingModule,
                SharedTestModule,
                ToastrModule.forRoot(),
                MatIconModule,
                RouterModule,
            ],
            providers: [Apollo],
        })
            .overrideComponent(OverviewComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        registerMatSvgIcons();

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        datasetSubsService.emitOverviewChanged({
            schema: mockMetadataDerivedUpdate.schema,
            content: mockOverviewDataUpdate.content,
            overview: structuredClone(mockOverviewDataUpdate.overview), // clone, as we modify this data in the tests
            size: mockOverviewDataUpdate.size,
        } as OverviewUpdate);

        navigationService = TestBed.inject(NavigationService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        modalService = TestBed.inject(NgbModal);
        loggedUserService = TestBed.inject(LoggedUserService);
        datasetCollaborationsService = TestBed.inject(DatasetCollaborationsService);

        fixture = TestBed.createComponent(OverviewComponent);
        component = fixture.componentInstance;
        component.datasetBasics = {
            id: mockOverviewDataUpdate.overview.id,
            kind: mockOverviewDataUpdate.overview.kind,
            name: mockOverviewDataUpdate.overview.name,
            alias: mockOverviewDataUpdate.overview.alias,
            owner: {
                __typename: "Account",
                id: mockOverviewDataUpdate.overview.owner.id,
                accountName: mockOverviewDataUpdate.overview.owner.accountName,
            },
            visibility: mockPublicDatasetVisibility,
        };
        spyOn(datasetCollaborationsService, "getRoleByDatasetId").and.returnValue(of(null));
        component.datasetPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment); // clone, as we modify this data in the tests

        fixture.detectChanges();
    });

    function currentOverview(): DatasetOverviewFragment {
        if (component.currentState) {
            return component.currentState.overview;
        } else {
            throw new Error("Current state must be defined");
        }
    }

    function currentInfo(): DatasetCurrentInfoFragment {
        return currentOverview().metadata.currentInfo;
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #ngOninit", () => {
        expect(component.metadataFragmentBlock).toBeDefined();
        expect(component.currentState).toBeDefined();
    });

    it("no metadata block if no current state, and mostly cannot do anything", () => {
        component.currentState = undefined;
        fixture.detectChanges();

        expect(component.metadataFragmentBlock).toBeUndefined();

        expect(component.canAddDatasetInfo).toBeFalse();
        expect(component.canAddLicense).toBeFalse();
        expect(component.canAddReadme).toBeFalse();
        expect(component.canAddSetPollingSource).toBeFalse();
        expect(component.canAddSetTransform).toBeFalse();
        expect(component.canAddWatermark).toBeFalse();

        expect(component.canEditDatasetInfo).toBeFalse();
        expect(component.canEditLicense).toBeFalse();
        expect(component.canEditReadme).toBeFalse();
        expect(component.canEditWatermark).toBeFalse();
    });

    it("should check open website", () => {
        const navigationServiceSpy = spyOn(navigationService, "navigateToWebsite");
        const testWebsite = "http://google.com";
        component.showWebsite(testWebsite);
        expect(navigationServiceSpy).toHaveBeenCalledWith(testWebsite);
    });

    it("should select topic name", () => {
        const topicName = "test topic name";
        const emitterSubscription$ = component.selectTopicEmit
            .pipe(first())
            .subscribe((name: string) => expect(name).toEqual(topicName));

        component.selectTopic(topicName);
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should open information modal window", () => {
        const openModalSpy = spyOn(modalService, "open").and.callThrough();
        component.openInformationModal();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should open license modal window", () => {
        const openModalSpy = spyOn(modalService, "open").and.callThrough();
        component.openLicenseModal();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should check Update now button is not visible", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(false);
        fixture.detectChanges();
        const updateButton = findElementByDataTestId(fixture, "refresh-now-button");
        expect(updateButton).toBe(undefined);
    });

    it("should check Update now button is not visible when enableScheduling flag eqgual falsw", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        spyOnProperty(component, "enableScheduling", "get").and.returnValue(false);
        fixture.detectChanges();
        const updateButton = findElementByDataTestId(fixture, "refresh-now-button");
        expect(updateButton).toBe(undefined);
    });

    it("should open set watermark window", () => {
        const openModalSpy = spyOn(modalService, "open").and.callThrough();
        component.openWatermarkModal();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should check navigate to flows tab when 'refresh now' button was clicked", fakeAsync(() => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        const datasetTriggerFlowSpy = spyOn(datasetFlowsService, "datasetTriggerFlow").and.returnValue(of(true));
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "refresh-now-button");
        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ tab: DatasetViewTypeEnum.Flows }),
        );
        expect(datasetTriggerFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    describe("SetPollingSource", () => {
        it("should be possible to add polling source for root dataset and commit permissions", () => {
            // By default, we have a root dataset and commit permissions, and a ready polling source, swe reset it here
            currentOverview().metadata.currentPollingSource = undefined;
            expect(component.datasetPermissions.permissions.metadata.canCommit).toBeTrue();

            expect(component.canAddSetPollingSource).toBeTrue();
        });

        it("cannot add set polling source when no permissions", () => {
            component.datasetPermissions.permissions.metadata.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddSetPollingSource).toBeFalse();
        });

        it("cannot add set polling source when having a derived dataset", () => {
            component.datasetBasics.kind = DatasetKind.Derivative;
            fixture.detectChanges();

            expect(component.canAddSetPollingSource).toBeFalse();
        });

        it("cannot add set polling source if polling source already exists", () => {
            currentOverview().metadata.currentPollingSource = { __typename: "SetPollingSource" };
            fixture.detectChanges();

            expect(component.canAddSetPollingSource).toBeFalse();
        });

        it("should check refresh button is disabled when currentPollingSource=undefined=null ", () => {
            currentOverview().metadata.currentPollingSource = null;
            spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
            fixture.detectChanges();

            const refreshButton = findElementByDataTestId(fixture, "refresh-now-button") as HTMLButtonElement;
            expect(refreshButton.disabled).toBeTrue();
        });

        it("should check show Add data button without currentPollingSource", () => {
            currentOverview().metadata.currentPollingSource = null;
            spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
            fixture.detectChanges();

            expect(component.showAddDataButton).toEqual(true);
        });

        it("should check don't show Add data button with currentPollingSource", () => {
            spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
            fixture.detectChanges();

            expect(component.showAddDataButton).toEqual(false);
        });
    });

    describe("SetTransform", () => {
        beforeEach(() => {
            component.datasetBasics.kind = DatasetKind.Derivative;
            currentOverview().metadata.currentPollingSource = undefined;
            fixture.detectChanges();
        });

        it("should be possible to add transform for derived dataset and with commit permissions", () => {
            expect(component.datasetPermissions.permissions.metadata.canCommit).toBeTrue();

            expect(component.canAddSetTransform).toBeTrue();
        });

        it("cannot add set transform when no permissions", () => {
            component.datasetPermissions.permissions.metadata.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddSetTransform).toBeFalse();
        });

        it("cannot add set transform source when having a root dataset", () => {
            component.datasetBasics.kind = DatasetKind.Root;
            fixture.detectChanges();

            expect(component.canAddSetTransform).toBeFalse();
        });

        it("cannot add set transform if transform already exists", () => {
            currentOverview().metadata.currentTransform = { __typename: "SetTransform" };
            fixture.detectChanges();

            expect(component.canAddSetTransform).toBeFalse();
        });

        it("should check refresh button is disabled when currentTransform=null", () => {
            currentOverview().metadata.currentTransform = null;
            spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
            fixture.detectChanges();

            const refreshButton = findElementByDataTestId(fixture, "refresh-now-button") as HTMLButtonElement;
            expect(refreshButton.disabled).toBeTrue();
        });

        it("should check show Add data button without currentTransform", () => {
            component.datasetBasics = mockDatasetBasicsDerivedFragment;
            currentOverview().metadata.currentTransform = null;
            spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
            fixture.detectChanges();

            expect(component.showAddDataButton).toEqual(true);
        });

        it("should check don't show Add data button with currentTransform", () => {
            component.datasetBasics = mockDatasetBasicsDerivedFragment;
            currentOverview().metadata.currentTransform = { __typename: "SetTransform" };
            spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
            fixture.detectChanges();

            expect(component.showAddDataButton).toEqual(false);
        });
    });

    describe("can add or edit dataset info", () => {
        it("can add dataset info, but not edit it, with full permissions and no info predefined", () => {
            // All permissions set by default
            // No info by default
            expect(component.datasetPermissions.permissions.metadata.canCommit).toBeTrue();
            expect(currentOverview().metadata.currentInfo.description).toBeFalsy();
            expect(currentOverview().metadata.currentInfo.keywords).toBeFalsy();

            expect(component.hasDatasetInfo).toBeFalse();
            expect(component.canAddDatasetInfo).toBeTrue();
            expect(component.canEditDatasetInfo).toBeFalse();
        });

        it("cannot add or edit dataset info without commit permissions and without existing info", () => {
            component.datasetPermissions.permissions.metadata.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddDatasetInfo).toBeFalse();
            expect(component.canEditDatasetInfo).toBeFalse();
        });

        it("cannot add or edit dataset info without commit permissions, but with existing info", () => {
            component.datasetPermissions.permissions.metadata.canCommit = false;
            currentInfo().description = "someDescription";
            fixture.detectChanges();

            expect(component.canAddDatasetInfo).toBeFalse();
            expect(component.canEditDatasetInfo).toBeFalse();
        });

        it("cannot add dataset info, if info description is available, but can edit", () => {
            currentInfo().description = "someDescription";
            fixture.detectChanges();

            expect(component.hasDatasetInfo).toBeTrue();
            expect(component.canAddDatasetInfo).toBeFalse();
            expect(component.canEditDatasetInfo).toBeTrue();
        });

        it("cannot add dataset info, if a keyword is defined, but can edit", () => {
            currentInfo().keywords = ["keyword"];
            fixture.detectChanges();

            expect(component.hasDatasetInfo).toBeTrue();
            expect(component.canAddDatasetInfo).toBeFalse();
            expect(component.canEditDatasetInfo).toBeTrue();
        });

        it("can add dataset info, if a keywords array is empty, but can't edit", () => {
            currentInfo().keywords = [];
            fixture.detectChanges();

            expect(component.hasDatasetInfo).toBeFalse();
            expect(component.canAddDatasetInfo).toBeTrue();
            expect(component.canEditDatasetInfo).toBeFalse();
        });
    });

    describe("can add or edit readme", () => {
        it("can add readme but not edit it, with full permissions and no readme predefined", () => {
            // All permissions set by default
            // No readme by default
            expect(component.datasetPermissions.permissions.metadata.canCommit).toBeTrue();
            expect(currentOverview().metadata.currentReadme).toBeFalsy();

            expect(component.canAddReadme).toBeTrue();
            expect(component.canEditReadme).toBeFalse();
        });

        it("cannot add readme if already started adding", () => {
            component.onAddReadme();

            expect(component.canAddReadme).toBeFalse();
            expect(component.canEditReadme).toBeFalse();
        });

        it("cannot add or edit readme without commit permissions and without existing readme", () => {
            component.datasetPermissions.permissions.metadata.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddReadme).toBeFalse();
            expect(component.canEditReadme).toBeFalse();
        });

        it("cannot add readme, if readme is available, but can edit", () => {
            currentOverview().metadata.currentReadme = "some readme";
            fixture.detectChanges();

            expect(component.canAddReadme).toBeFalse();
            expect(component.canEditReadme).toBeTrue();
        });
    });

    describe("can add or edit license info", () => {
        it("can add license  but not edit it, with full permissions and no license predefined", () => {
            // All permissions set by default
            // No license by default
            expect(component.datasetPermissions.permissions.metadata.canCommit).toBeTrue();
            expect(currentOverview().metadata.currentLicense).toBeFalsy();

            expect(component.canAddLicense).toBeTrue();
            expect(component.canEditLicense).toBeFalse();
        });

        it("cannot add or edit license without commit permissions and without existing license", () => {
            component.datasetPermissions.permissions.metadata.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddLicense).toBeFalse();
            expect(component.canEditLicense).toBeFalse();
        });

        it("cannot add license, if license is available, but can edit", () => {
            currentOverview().metadata.currentLicense = mockSetLicense;
            fixture.detectChanges();

            expect(component.canAddLicense).toBeFalse();
            expect(component.canEditLicense).toBeTrue();
        });
    });

    describe("can add or edit watermark", () => {
        it("can edit watermark  but not add it, with full permissions, root dataset, and watermark predefined", () => {
            // All permissions set by default
            // Root dataset by default
            // Having watermark by default
            expect(component.datasetPermissions.permissions.metadata.canCommit).toBeTrue();
            expect(currentOverview().metadata.currentWatermark).toBeTruthy();

            expect(component.canAddWatermark).toBeFalse();
            expect(component.canEditWatermark).toBeTruthy();
        });

        it("can add watermark, but not edit it, with full permissions, root dataset, and no watermark predefined", () => {
            currentOverview().metadata.currentWatermark = undefined;
            fixture.detectChanges();

            expect(component.canAddWatermark).toBeTrue();
            expect(component.canEditWatermark).toBeFalse();
        });

        it("cannot add or edit watermark without commit permissions", () => {
            component.datasetPermissions.permissions.metadata.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddWatermark).toBeFalse();
            expect(component.canEditWatermark).toBeFalse();

            currentOverview().metadata.currentWatermark = undefined;
            fixture.detectChanges();

            expect(component.canAddWatermark).toBeFalse();
            expect(component.canEditWatermark).toBeFalse();
        });

        it("cannot add or edit watermark with derived dataset", () => {
            component.datasetBasics.kind = DatasetKind.Derivative;
            fixture.detectChanges();

            expect(component.canAddWatermark).toBeFalse();
            expect(component.canEditWatermark).toBeFalse();

            currentOverview().metadata.currentWatermark = undefined;
            fixture.detectChanges();

            expect(component.canAddWatermark).toBeFalse();
            expect(component.canEditWatermark).toBeFalse();
        });
    });
});
