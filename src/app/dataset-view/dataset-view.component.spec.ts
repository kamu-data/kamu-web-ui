/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "../search/mock.data";
import { DatasetService } from "./dataset.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "../api/dataset.api";
import { DatasetViewComponent } from "./dataset-view.component";
import { NavigationService } from "../services/navigation.service";
import { DatasetViewTypeEnum } from "./dataset-view.interface";
import { of } from "rxjs";
import { OverviewComponent } from "./additional-components/overview-component/overview.component";
import { DatasetViewMenuComponent } from "./dataset-view-menu/dataset-view-menu.component";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { DatasetViewHeaderComponent } from "./dataset-view-header/dataset-view-header.component";
import { SearchAdditionalButtonsComponent } from "../common/components/search-additional-buttons/search-additional-buttons.component";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule, provideAnimations } from "@angular/platform-browser/animations";
import { SearchAdditionalButtonsNavComponent } from "../common/components/search-additional-buttons/search-additional-buttons-nav.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatIconModule } from "@angular/material/icon";
import { ChangeDetectionStrategy } from "@angular/core";
import { DatasetSubscriptionsService } from "./dataset.subscriptions.service";
import { DatasetSettingsComponent } from "./additional-components/dataset-settings-component/dataset-settings.component";
import { MatDividerModule } from "@angular/material/divider";
import { DataComponent } from "./additional-components/data-component/data.component";
import { MetadataComponent } from "./additional-components/metadata-component/metadata.component";
import { HistoryComponent } from "./additional-components/history-component/history.component";
import { LineageComponent } from "./additional-components/lineage-component/lineage.component";
import { DatasetSettingsGeneralTabComponent } from "./additional-components/dataset-settings-component/tabs/general/dataset-settings-general-tab.component";
import { DatasetSettingsSchedulingTabComponent } from "./additional-components/dataset-settings-component/tabs/scheduling/dataset-settings-scheduling-tab.component";
import { provideToastr } from "ngx-toastr";
import { SqlEditorComponent } from "../editor/components/sql-editor/sql-editor.component";
import { RequestTimerComponent } from "../query/shared/request-timer/request-timer.component";
import { EditorModule } from "../editor/editor.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { FlowsComponent } from "./additional-components/flows-component/flows.component";
import { RouterTestingModule } from "@angular/router/testing";
import { QueryAndResultSectionsComponent } from "../query/shared/query-and-result-sections/query-and-result-sections.component";
import { SavedQueriesSectionComponent } from "../query/shared/saved-queries-section/saved-queries-section.component";
import { SearchAndSchemasSectionComponent } from "../query/global-query/search-and-schemas-section/search-and-schemas-section.component";
import { registerMatSvgIcons } from "../common/helpers/base-test.helpers.spec";
import { MOCK_DATASET_INFO } from "./additional-components/metadata-component/components/set-transform/mock.data";

describe("DatasetViewComponent", () => {
    let component: DatasetViewComponent;
    let fixture: ComponentFixture<DatasetViewComponent>;
    let datasetService: DatasetService;
    let datasetSubsServices: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    const MOCK_DATASET_ROUTE = "kamu/mockNameDerived";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ApolloModule,
                ApolloTestingModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                MatDividerModule,
                MatIconModule,
                MatMenuModule,
                MatTabsModule,
                MatButtonToggleModule,
                FormsModule,
                ReactiveFormsModule,
                RouterModule,
                EditorModule,
                MatProgressBarModule,
                CdkAccordionModule,
                RouterTestingModule.withRoutes([{ path: MOCK_DATASET_ROUTE, component: DatasetViewComponent }]),
                DatasetViewComponent,
                OverviewComponent,
                DataComponent,
                MetadataComponent,
                HistoryComponent,
                LineageComponent,
                DatasetSettingsComponent,
                DatasetViewMenuComponent,
                DatasetViewHeaderComponent,
                SearchAdditionalButtonsComponent,
                SearchAdditionalButtonsNavComponent,
                DatasetSettingsGeneralTabComponent,
                DatasetSettingsSchedulingTabComponent,
                SqlEditorComponent,
                RequestTimerComponent,
                FlowsComponent,
                QueryAndResultSectionsComponent,
                SavedQueriesSectionComponent,
                SearchAndSchemasSectionComponent,
            ],
            providers: [
                DatasetApi,
                Apollo,
                provideAnimations(),
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "tab":
                                            return null;
                                        case "page":
                                            return "2";
                                    }
                                },
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
        })
            .overrideComponent(DatasetViewComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        // Note: for some reason this icon is not loaded when activating Settings tab, so stub it
        registerMatSvgIcons();

        datasetSubsServices = TestBed.inject(DatasetSubscriptionsService);
        datasetSubsServices.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetService = TestBed.inject(DatasetService);
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsDerivedFragment));

        fixture = TestBed.createComponent(DatasetViewComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasetViewType = DatasetViewTypeEnum.Overview;
        component.datasetViewData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        };
        component.datasetInfo = MOCK_DATASET_INFO;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to owner view", () => {
        fixture.detectChanges();
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.showOwnerPage(mockDatasetBasicsDerivedFragment.owner.accountName);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(mockDatasetBasicsDerivedFragment.owner.accountName);
    });

    it(`should check remove daaset sql code`, () => {
        const removeDatasetSqlCodeSpy = spyOn(sessionStorage, "removeItem");

        component.ngOnDestroy();
        expect(removeDatasetSqlCodeSpy).toHaveBeenCalledTimes(1);
    });
});
