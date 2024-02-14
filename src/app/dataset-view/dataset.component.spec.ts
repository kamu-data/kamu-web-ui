import { ToastrModule } from "ngx-toastr";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetInfo,
    mockFullPowerDatasetPermissionsFragment,
    mockNode,
    mockNodesWithEqualNames,
    mockReadonlyDatasetPermissionsFragment,
} from "../search/mock.data";
import { DatasetService } from "./dataset.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "../api/dataset.api";
import { DatasetComponent } from "./dataset.component";
import { NavigationService } from "../services/navigation.service";
import { DatasetViewTypeEnum } from "./dataset-view.interface";
import { of } from "rxjs";
import { routerMock, routerMockEventSubject } from "../common/base-test.helpers.spec";
import { OverviewComponent } from "./additional-components/overview-component/overview.component";
import { DatasetViewMenuComponent } from "./dataset-view-menu/dataset-view-menu.component";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { DatasetViewHeaderComponent } from "./dataset-view-header/dataset-view-header.component";
import { SearchAdditionalButtonsComponent } from "../components/search-additional-buttons/search-additional-buttons.component";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SearchAdditionalButtonsNavComponent } from "../components/search-additional-buttons/search-additional-buttons-nav.component";
import { AngularSvgIconModule, SvgIconRegistryService } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatIconModule } from "@angular/material/icon";
import AppValues from "../common/app.values";
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

describe("DatasetComponent", () => {
    let component: DatasetComponent;
    let fixture: ComponentFixture<DatasetComponent>;
    let datasetService: DatasetService;
    let datasetSubsServices: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let route: ActivatedRoute;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DatasetComponent,
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
            ],
            imports: [
                AngularSvgIconModule.forRoot(),
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
                RouterTestingModule,
                ToastrModule.forRoot(),
            ],
            providers: [
                DatasetApi,
                Apollo,
                {
                    provide: Router,
                    useValue: routerMock,
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "tab":
                                            return "overview";
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
            .overrideComponent(DatasetComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        // Note: for some reason this icon is not loaded when activating Settings tab, so stub it
        const iconRegistryService: SvgIconRegistryService = TestBed.inject(SvgIconRegistryService);
        iconRegistryService.addSvg("account", "");
        iconRegistryService.addSvg("clock", "");

        datasetSubsServices = TestBed.inject(DatasetSubscriptionsService);
        datasetSubsServices.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);

        datasetService = TestBed.inject(DatasetService);
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsDerivedFragment));
        spyOn(datasetService, "requestDatasetMainData").and.returnValue(of(void {}));

        fixture = TestBed.createComponent(DatasetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        route = TestBed.inject(ActivatedRoute);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    function routeToTab(tabAsString: string): void {
        const spyRoute = spyOn(route.snapshot.queryParamMap, "get");
        spyRoute.and.callFake((queryParam: "tab" | "page") => {
            switch (queryParam) {
                case "tab": {
                    return tabAsString;
                }
                case "page": {
                    return null;
                }
            }
        });
        routerMockEventSubject.next(new NavigationEnd(1, "", "redirectUrl"));
    }

    [
        DatasetViewTypeEnum.Overview,
        DatasetViewTypeEnum.Data,
        DatasetViewTypeEnum.Metadata,
        DatasetViewTypeEnum.History,
        DatasetViewTypeEnum.Lineage,
        DatasetViewTypeEnum.Discussions,
        DatasetViewTypeEnum.Settings,
    ].forEach((tab: DatasetViewTypeEnum) => {
        it(`should check init ${tab} tab`, () => {
            routeToTab(tab);
            fixture.detectChanges();

            expect(component.datasetViewType).toEqual(tab);
        });
    });

    it("attempt navigating to non-existing tab lands on overview", () => {
        routeToTab("wrong");
        fixture.detectChanges();

        expect(component.datasetViewType).toEqual(DatasetViewTypeEnum.Overview);
    });

    it("attempt navigating to settings without necessary permissions lands on overview", () => {
        datasetSubsServices.emitPermissionsChanged(mockReadonlyDatasetPermissionsFragment);
        routeToTab(DatasetViewTypeEnum.Settings);
        fixture.detectChanges();

        expect(component.datasetViewType).toEqual(DatasetViewTypeEnum.Overview);
    });

    it("should check run SQL request", () => {
        const params = {
            query: "select * from test.table",
            skip: 50,
            limit: AppValues.SQL_QUERY_LIMIT,
        };

        const requestDatasetDataSqlRunSpy = spyOn(datasetService, "requestDatasetDataSqlRun").and.returnValue(of());
        component.onRunSQLRequest(params);
        expect(requestDatasetDataSqlRunSpy).toHaveBeenCalledWith(params);
    });

    it("should check page changed", () => {
        const testPageNumber = 2;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onPageChange(testPageNumber);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(jasmine.objectContaining({ page: testPageNumber }));
    });

    it("should check #selectDataset with account and dataset name", () => {
        const testAccountName = "john";
        const testDatasetName = "alberta.tcc";
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onSelectDataset(testAccountName, testDatasetName);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ accountName: testAccountName, datasetName: testDatasetName }),
        );
    });

    it("should check #selectDataset without names", () => {
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
        const selectDatasetSpy = spyOn(component, "onSelectDataset");
        component.onClickLineageNode(mockNode);

        const mockNodeData: LineageGraphNodeData = mockNode.data as LineageGraphNodeData;
        expect(selectDatasetSpy).toHaveBeenCalledWith(
            mockNodeData.dataObject.accountName,
            mockNodeData.dataObject.name,
        );
    });

    it("should check click on lineage nodes with equal dataset name, but different account name ", () => {
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

    it("should check navigate to overview tab", () => {
        const selectDatasetSpy = spyOn(navigationService, "navigateToDatasetView");
        component.getDatasetNavigation(mockDatasetInfo).navigateToOverview();
        expect(selectDatasetSpy).toHaveBeenCalledWith({
            datasetName: mockDatasetInfo.datasetName,
            accountName: mockDatasetInfo.accountName,
        });
    });

    it("should check navigate to data tab", () => {
        const selectDatasetSpy = spyOn(navigationService, "navigateToDatasetView");
        component.getDatasetNavigation(mockDatasetInfo).navigateToData();
        expect(selectDatasetSpy).toHaveBeenCalledWith(jasmine.objectContaining({ tab: DatasetViewTypeEnum.Data }));
    });

    it("should check navigate to metadata tab", () => {
        const selectDatasetSpy = spyOn(navigationService, "navigateToDatasetView");
        component.getDatasetNavigation(mockDatasetInfo).navigateToMetadata(1);
        expect(selectDatasetSpy).toHaveBeenCalledWith(jasmine.objectContaining({ tab: DatasetViewTypeEnum.Metadata }));
    });

    it("should check navigate to history tab", () => {
        const selectDatasetSpy = spyOn(navigationService, "navigateToDatasetView");
        component.getDatasetNavigation(mockDatasetInfo).navigateToHistory(1);
        expect(selectDatasetSpy).toHaveBeenCalledWith(jasmine.objectContaining({ tab: DatasetViewTypeEnum.History }));
    });

    it("should check navigate to lineage tab", () => {
        const selectDatasetSpy = spyOn(navigationService, "navigateToDatasetView");
        component.getDatasetNavigation(mockDatasetInfo).navigateToLineage();
        expect(selectDatasetSpy).toHaveBeenCalledWith(jasmine.objectContaining({ tab: DatasetViewTypeEnum.Lineage }));
    });

    it("should check navigate to discussions tab", () => {
        const selectDatasetSpy = spyOn(navigationService, "navigateToDatasetView");
        component.getDatasetNavigation(mockDatasetInfo).navigateToDiscussions();
        expect(selectDatasetSpy).not.toHaveBeenCalled(); // TODO: implement discussions
    });

    it("should check navigate to settings tab", () => {
        const selectDatasetSpy = spyOn(navigationService, "navigateToDatasetView");
        component.getDatasetNavigation(mockDatasetInfo).navigateToSettings();
        expect(selectDatasetSpy).toHaveBeenCalledWith(jasmine.objectContaining({ tab: DatasetViewTypeEnum.Settings }));
    });

    it("should check navigate to owner view", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.showOwnerPage(mockDatasetBasicsDerivedFragment.owner.accountName);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(mockDatasetBasicsDerivedFragment.owner.accountName);
    });
});
