/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    mockDatasetBasicsDerivedFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockNode,
    mockNodesWithEqualNames,
} from "../search/mock.data";
import { DatasetService } from "./dataset.service";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "../api/dataset.api";
import { DatasetViewComponent } from "./dataset-view.component";
import { NavigationService } from "../services/navigation.service";
import { DatasetViewTypeEnum } from "./dataset-view.interface";
import { delay, of, Subject } from "rxjs";
import { OverviewComponent } from "./additional-components/overview-component/overview.component";
import { DatasetViewMenuComponent } from "./dataset-view-menu/dataset-view-menu.component";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { DatasetViewHeaderComponent } from "./dataset-view-header/dataset-view-header.component";
import { SearchAdditionalButtonsComponent } from "../common/components/search-additional-buttons/search-additional-buttons.component";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SearchAdditionalButtonsNavComponent } from "../common/components/search-additional-buttons/search-additional-buttons-nav.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatIconModule } from "@angular/material/icon";
import AppValues from "../common/values/app.values";
import { LineageGraphNodeData } from "./additional-components/lineage-component/lineage-model";
import { ChangeDetectionStrategy } from "@angular/core";
import { DatasetSubscriptionsService } from "./dataset.subscriptions.service";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { DatasetSettingsComponent } from "./additional-components/dataset-settings-component/dataset-settings.component";
import { MatDividerModule } from "@angular/material/divider";
import { DataComponent } from "./additional-components/data-component/data.component";
import { MetadataComponent } from "./additional-components/metadata-component/metadata.component";
import { HistoryComponent } from "./additional-components/history-component/history.component";
import { LineageComponent } from "./additional-components/lineage-component/lineage.component";
import { DatasetSettingsGeneralTabComponent } from "./additional-components/dataset-settings-component/tabs/general/dataset-settings-general-tab.component";
import { DatasetSettingsSchedulingTabComponent } from "./additional-components/dataset-settings-component/tabs/scheduling/dataset-settings-scheduling-tab.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DataAccessPanelModule } from "../data-access-panel/data-access-panel.module";
import { SqlEditorComponent } from "../editor/components/sql-editor/sql-editor.component";
import { RequestTimerComponent } from "../query/shared/request-timer/request-timer.component";
import { EditorModule } from "../editor/editor.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { FlowsComponent } from "./additional-components/flows-component/flows.component";
import { DatasetVisibilityModule } from "../common/components/dataset-visibility/dataset-visibility.module";
import { RouterTestingModule } from "@angular/router/testing";
import { promiseWithCatch } from "../common/helpers/app.helpers";
import { QueryAndResultSectionsComponent } from "../query/shared/query-and-result-sections/query-and-result-sections.component";
import { SavedQueriesSectionComponent } from "../query/shared/saved-queries-section/saved-queries-section.component";
import { SqlQueryService } from "../services/sql-query.service";
import { SearchAndSchemasSectionComponent } from "../query/global-query/search-and-schemas-section/search-and-schemas-section.component";
import { DatasetRequestBySql } from "../interface/dataset.interface";
import { registerMatSvgIcons } from "../common/helpers/base-test.helpers.spec";
import { MOCK_NODES } from "../api/mock/dataset.mock";
import { FeatureFlagModule } from "../common/directives/feature-flag.module";

describe("DatasetViewComponent", () => {
    let component: DatasetViewComponent;
    let fixture: ComponentFixture<DatasetViewComponent>;
    let datasetService: DatasetService;
    let datasetSubsServices: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let sqlQueryService: SqlQueryService;
    let route: ActivatedRoute;
    let router: Router;
    let toastrService: ToastrService;
    const MOCK_DATASET_ROUTE = "kamu/mockNameDerived";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
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
                ToastrModule.forRoot(),
                DataAccessPanelModule,
                EditorModule,
                MatProgressBarModule,
                CdkAccordionModule,
                DatasetVisibilityModule,
                FeatureFlagModule,
                RouterTestingModule.withRoutes([{ path: MOCK_DATASET_ROUTE, component: DatasetViewComponent }]),
            ],
            providers: [
                DatasetApi,
                Apollo,

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
        sqlQueryService = TestBed.inject(SqlQueryService);
        datasetService = TestBed.inject(DatasetService);
        router = TestBed.inject(Router);
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsDerivedFragment));

        fixture = TestBed.createComponent(DatasetViewComponent);
        router.initialNavigation();
        route = TestBed.inject(ActivatedRoute);
        toastrService = TestBed.inject(ToastrService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    [
        DatasetViewTypeEnum.Overview,
        DatasetViewTypeEnum.Data,
        DatasetViewTypeEnum.Metadata,
        DatasetViewTypeEnum.History,
        DatasetViewTypeEnum.Lineage,
        DatasetViewTypeEnum.Discussions,
        DatasetViewTypeEnum.Flows,
    ].forEach((tab: DatasetViewTypeEnum) => {
        it(`should check init ${tab} tab`, () => {
            spyOn(route.snapshot.queryParamMap, "get").and.returnValue(tab);
            component.ngOnInit();

            expect(component.datasetViewType).toEqual(tab);
        });
    });

    it("attempt navigating to non-existing tab lands on overview", () => {
        spyOn(route.snapshot.queryParamMap, "get").and.returnValue("wrong");
        fixture.detectChanges();

        expect(component.datasetViewType).toEqual(DatasetViewTypeEnum.Overview);
    });

    it("should check run SQL request", () => {
        const params = {
            query: "select * from test.table",
            skip: 50,
            limit: AppValues.SQL_QUERY_LIMIT,
        };

        const requestDatasetDataSqlRunSpy = spyOn(sqlQueryService, "requestDataSqlRun").and.returnValue(of());
        component.onRunSQLRequest(params);
        expect(requestDatasetDataSqlRunSpy).toHaveBeenCalledWith(params);
    });

    it("should check page changed", () => {
        fixture.detectChanges();
        const testPageNumber = 2;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onPageChange(testPageNumber);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(jasmine.objectContaining({ page: testPageNumber }));
    });

    it("should check #selectDataset with account and dataset name", () => {
        fixture.detectChanges();
        const testAccountName = "john";
        const testDatasetName = "alberta.tcc";
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onSelectDataset(testAccountName, testDatasetName);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ accountName: testAccountName, datasetName: testDatasetName }),
        );
    });

    it("should check #selectDataset without names", () => {
        fixture.detectChanges();
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onSelectDataset();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                accountName: mockDatasetBasicsDerivedFragment.owner.accountName,
                datasetName: mockDatasetBasicsDerivedFragment.name,
            }),
        );
    });

    it("should check click on lineage node ", () => {
        fixture.detectChanges();
        const selectDatasetSpy = spyOn(component, "onSelectDataset");
        component.onClickLineageNode(mockNode);

        const mockNodeData: LineageGraphNodeData = mockNode.data as LineageGraphNodeData;
        expect(selectDatasetSpy).toHaveBeenCalledWith(
            mockNodeData.dataObject.accountName,
            mockNodeData.dataObject.name,
        );
    });

    it("should check click on lineage nodes with equal dataset name, but different account name ", () => {
        fixture.detectChanges();
        const navigationServiceSpy = spyOn(navigationService, "navigateToDatasetView");
        mockNodesWithEqualNames.forEach((node: Node) => {
            component.onClickLineageNode(node);
            const mockNodeData = node.data as LineageGraphNodeData;
            expect(navigationServiceSpy).toHaveBeenCalledWith({
                accountName: mockNodeData.dataObject.accountName,
                datasetName: mockNodeData.dataObject.name,
                tab: DatasetViewTypeEnum.Lineage,
            });
        });
    });

    it("should check navigate to owner view", () => {
        fixture.detectChanges();
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.showOwnerPage(mockDatasetBasicsDerivedFragment.owner.accountName);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(mockDatasetBasicsDerivedFragment.owner.accountName);
    });

    // TODO: investigate why the test does not work
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit("should count the request time if the result is successful", fakeAsync(() => {
        const params = {
            query: "select * from test.table",
            skip: 50,
            limit: AppValues.SQL_QUERY_LIMIT,
        };

        spyOn(sqlQueryService, "requestDataSqlRun").and.returnValue(of().pipe(delay(1000)));
        component.onRunSQLRequest(params);
        tick(500);

        expect(component.sqlLoading).toEqual(true);
        flush();
    }));

    [DatasetViewTypeEnum.Lineage, DatasetViewTypeEnum.Settings, DatasetViewTypeEnum.Flows].forEach(
        (tab: DatasetViewTypeEnum) => {
            it(`should check navigate to ${tab} tab`, fakeAsync(() => {
                const requestDatasetMainDataSpy = spyOn(datasetService, "requestDatasetMainData").and.returnValue(
                    of(void {}),
                );
                const isHeadHashBlockChangedSpy = spyOn(datasetService, "isHeadHashBlockChanged").and.returnValue(
                    of(false),
                );
                fixture.detectChanges();
                promiseWithCatch(router.navigate([MOCK_DATASET_ROUTE], { queryParams: { tab } }));
                tick();

                expect(requestDatasetMainDataSpy).toHaveBeenCalledTimes(1);
                expect(isHeadHashBlockChangedSpy).toHaveBeenCalledTimes(1);
                flush();
            }));
        },
    );

    [DatasetViewTypeEnum.Overview, DatasetViewTypeEnum.Data, DatasetViewTypeEnum.Metadata].forEach(
        (tab: DatasetViewTypeEnum) => {
            it(`should check navigate to ${tab} tab`, fakeAsync(() => {
                const requestDatasetMainDataSpy = spyOn(datasetService, "requestDatasetMainData").and.returnValue(
                    of(void {}),
                );
                const isHeadHashBlockChangedSpy = spyOn(datasetService, "isHeadHashBlockChanged").and.returnValue(
                    of(true),
                );
                fixture.detectChanges();
                promiseWithCatch(router.navigate([MOCK_DATASET_ROUTE], { queryParams: { tab } }));
                tick();

                expect(requestDatasetMainDataSpy).toHaveBeenCalledTimes(2);
                expect(isHeadHashBlockChangedSpy).toHaveBeenCalledTimes(1);
                flush();
            }));
        },
    );

    it(`should check Data tab has sql request in the URL`, fakeAsync(() => {
        const mockObservable = new Subject<void>();
        spyOn(mockObservable, "subscribe").and.callThrough();

        spyOn(sqlQueryService, "requestDataSqlRun").and.returnValue(mockObservable);

        const params: DatasetRequestBySql = {
            query: "select *from 'kamu/account.tokens.portfolio'",
        };
        component.onRunSQLRequest(params);
        mockObservable.next();
        mockObservable.complete();

        tick();
        expect(router.url.includes("/?sqlQuery=select%20*from%20'kamu%2Faccount.tokens.portfolio'")).toEqual(true);
        flush();
    }));

    it(`should check remove daaset sql code`, () => {
        const removeDatasetSqlCodeSpy = spyOn(sessionStorage, "removeItem");

        component.ngOnDestroy();
        expect(removeDatasetSqlCodeSpy).toHaveBeenCalledTimes(1);
    });

    it("should check click on private node", () => {
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");
        component.onClickPrivateLineageNode(MOCK_NODES[2]);
        expect(toastrServiceSuccessSpy).toHaveBeenCalledWith("Copied ID");
    });
});
