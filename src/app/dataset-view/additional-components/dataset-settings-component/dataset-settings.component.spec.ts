import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsComponent } from "./dataset-settings.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ApolloTestingModule } from "apollo-angular/testing";
import { Apollo } from "apollo-angular";
import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
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
} from "src/app/common/base-test.helpers.spec";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ChangeDetectionStrategy } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import _ from "lodash";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { mockMetadataRootUpdate, mockOverviewDataUpdate } from "../data-tabs.mock";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "src/app/shared/shared/shared.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BatchingTriggerModule } from "./tabs/scheduling/batching-trigger-form/batching-trigger.module";

describe("DatasetSettingsComponent", () => {
    let component: DatasetSettingsComponent;
    let fixture: ComponentFixture<DatasetSettingsComponent>;
    let navigationService: NavigationService;
    let datasetSubsService: DatasetSubscriptionsService;

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
                SharedModule,
                MatCheckboxModule,
                BatchingTriggerModule,
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
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.datasetPermissions = mockFullPowerDatasetPermissionsFragment;
        datasetSubsService.emitOverviewChanged({
            schema: mockMetadataRootUpdate.schema,
            content: mockOverviewDataUpdate.content,
            overview: _.cloneDeep(mockOverviewDataUpdate.overview), // clone, as we modify this data in the tests
            size: mockOverviewDataUpdate.size,
        } as OverviewUpdate);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check hide the scheduling tab", () => {
        component.activeTab = SettingsTabsEnum.SCHEDULING;
        spyOnProperty(component, "isSchedulingAvailable", "get").and.returnValue(false);
        fixture.detectChanges();
        const schedulingTabElem = findElementByDataTestId(fixture, "settings-scheduling-tab");
        expect(schedulingTabElem).toBeUndefined();
    });

    it("should check navigate to action list item", () => {
        component.activeTab = SettingsTabsEnum.SCHEDULING;
        spyOnProperty(component, "isSchedulingAvailable", "get").and.returnValue(true);
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, `action-list-${SettingsTabsEnum.GENERAL}-tab`);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(jasmine.objectContaining({ section: undefined }));

        emitClickOnElementByDataTestId(fixture, `action-list-${SettingsTabsEnum.SCHEDULING}-tab`);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ section: SettingsTabsEnum.SCHEDULING }),
        );
    });
});
