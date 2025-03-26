/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsComponent } from "./dataset-settings.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ApolloTestingModule } from "apollo-angular/testing";
import { Apollo } from "apollo-angular";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ActivatedRoute } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { DatasetSettingsGeneralTabComponent } from "./tabs/general/dataset-settings-general-tab.component";
import { DatasetSettingsSchedulingTabComponent } from "./tabs/scheduling/dataset-settings-scheduling-tab.component";
import { SettingsTabsEnum } from "./dataset-settings.model";
import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    registerMatSvgIcons,
} from "src/app/common/helpers/base-test.helpers.spec";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ChangeDetectionStrategy } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { mockMetadataRootUpdate, mockOverviewDataUpdate } from "../data-tabs.mock";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BatchingTriggerModule } from "./tabs/scheduling/batching-trigger-form/batching-trigger.module";
import { DatasetVisibilityModule } from "src/app/common/components/dataset-visibility/dataset-visibility.module";
import { FeatureFlagModule } from "src/app/common/directives/feature-flag.module";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import AppValues from "src/app/common/values/app.values";

describe("DatasetSettingsComponent", () => {
    let component: DatasetSettingsComponent;
    let fixture: ComponentFixture<DatasetSettingsComponent>;
    let navigationService: NavigationService;
    let datasetSubsService: DatasetSubscriptionsService;
    let appConfigService: AppConfigService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DatasetSettingsComponent,
                DatasetSettingsGeneralTabComponent,
                DatasetSettingsSchedulingTabComponent,
                TooltipIconComponent,
            ],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        fragment: of(""),
                        snapshot: {
                            queryParamMap: {
                                get: () => null,
                            },
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return mockDatasetBasicsDerivedFragment.owner.accountName;
                                        case "datasetName":
                                            return mockDatasetBasicsDerivedFragment.name;
                                    }
                                },
                            },
                        },
                    },
                },
            ],
            imports: [
                ReactiveFormsModule,
                HttpClientTestingModule,
                MatDividerModule,
                MatIconModule,
                ApolloTestingModule,
                ToastrModule.forRoot(),
                MatDividerModule,
                MatSlideToggleModule,
                MatRadioModule,
                MatIconModule,
                NgbTooltipModule,
                MatCheckboxModule,
                BatchingTriggerModule,
                DatasetVisibilityModule,
                FeatureFlagModule,
                RouterTestingModule,
            ],
        })
            .overrideComponent(DatasetSettingsComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsComponent);
        navigationService = TestBed.inject(NavigationService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        appConfigService = TestBed.inject(AppConfigService);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.datasetPermissions = mockFullPowerDatasetPermissionsFragment;
        datasetSubsService.emitOverviewChanged({
            schema: mockMetadataRootUpdate.schema,
            content: mockOverviewDataUpdate.content,
            overview: structuredClone(mockOverviewDataUpdate.overview), // clone, as we modify this data in the tests
            size: mockOverviewDataUpdate.size,
        } as OverviewUpdate);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check hide the scheduling tab", () => {
        component.activeTab = SettingsTabsEnum.SCHEDULING;
        spyOnProperty(component, "isSettingsTabAccessible", "get").and.returnValue(false);
        fixture.detectChanges();
        const schedulingTabElem = findElementByDataTestId(fixture, "settings-scheduling-tab");
        expect(schedulingTabElem).toBeUndefined();
    });

    it("should check navigate to action list item", () => {
        component.activeTab = SettingsTabsEnum.SCHEDULING;
        spyOnProperty(component, "isSettingsTabAccessible", "get").and.returnValue(true);
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        spyOn(component, "visibilitySettingsMenuItem").and.returnValue(true);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, `action-list-${SettingsTabsEnum.SCHEDULING}-tab`);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ section: SettingsTabsEnum.SCHEDULING }),
        );

        component.activeTab = SettingsTabsEnum.GENERAL;
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, `action-list-${SettingsTabsEnum.GENERAL}-tab`);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(jasmine.objectContaining({ section: undefined }));
    });

    it(`should check navigate to ${SettingsTabsEnum.VARIABLES_AND_SECRETS} tab`, () => {
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.datasetPermissions = mockReadonlyDatasetPermissionsFragment;
        spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue(AppValues.DEFAULT_UI_FEATURE_FLAGS);
        component.ngOnInit();
        expect(component.activeTab).toEqual(SettingsTabsEnum.VARIABLES_AND_SECRETS);
    });
});
