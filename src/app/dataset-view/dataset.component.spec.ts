import { mockDatasetBasicsFragment, mockDatasetInfo, mockNode } from "./../search/mock.data";
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
import { OverviewComponent } from "./additional-components/overview-component/overview-component";
import { DatasetViewMenuComponent } from "./dataset-view-menu/dataset-view-menu-component";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { DatasetViewHeaderComponent } from "./dataset-view-header/dataset-view-header-component";
import { SearchAdditionalButtonsComponent } from "../components/search-additional-buttons/search-additional-buttons.component";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SearchAdditionalButtonsNavComponent } from "../components/search-additional-buttons/search-additional-buttons-nav.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatIconModule } from "@angular/material/icon";
import AppValues from "../common/app.values";

describe("DatasetComponent", () => {
    let component: DatasetComponent;
    let fixture: ComponentFixture<DatasetComponent>;
    let appDatasetService: DatasetService;
    let navigationService: NavigationService;
    let route: ActivatedRoute;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DatasetComponent,
                OverviewComponent,
                DatasetViewMenuComponent,
                DatasetViewHeaderComponent,
                SearchAdditionalButtonsComponent,
                SearchAdditionalButtonsNavComponent,
            ],
            imports: [
                ApolloModule,
                ApolloTestingModule,
                RouterTestingModule,
                MatMenuModule,
                MatButtonToggleModule,
                FormsModule,
                MatTabsModule,
                BrowserAnimationsModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                MatIconModule,
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
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsFragment;
        appDatasetService = TestBed.inject(DatasetService);
        route = TestBed.inject(ActivatedRoute);
        navigationService = TestBed.inject(NavigationService);
        fixture.detectChanges();
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
    ].forEach((tab: string) => {
        it(`should check init ${tab} tab`, () => {
            const spyRoute = spyOn(route.snapshot.queryParamMap, "get");
            spyRoute.and.callFake((queryParam: "tab" | "page") => {
                switch (queryParam) {
                    case "tab": {
                        return tab;
                    }
                    case "page": {
                        return null;
                    }
                }
            });
            appDatasetService.datasetChanges(mockDatasetBasicsFragment);
            component.ngOnInit();

            expect(component.datasetBasics).toBe(mockDatasetBasicsFragment);
        });
    });

    it("should check call getMainDataByLineageNode", () => {
        const getMainDataByLineageNodeSpy = spyOn(component, "getMainDataByLineageNode");
        routerMockEventSubject.next(new NavigationEnd(1, "", "redirectUrl"));
        expect(getMainDataByLineageNodeSpy).toHaveBeenCalledTimes(1);
    });

    it("should check run SQL request", () => {
        const params = {
            query: "select * from test.table",
            skip: 50,
            limit: AppValues.SQL_QUERY_LIMIT,
        };

        const requestDatasetDataSqlRunSpy = spyOn(appDatasetService, "requestDatasetDataSqlRun").and.returnValue(of());
        component.onRunSQLRequest(params);
        expect(requestDatasetDataSqlRunSpy).toHaveBeenCalledWith(params);
    });

    it("should check page changed", () => {
        const testPageNumber = 2;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onPageChange(testPageNumber);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(jasmine.objectContaining({ page: testPageNumber }));
    });

    it("should check #selectDataset with dataset name()", () => {
        const testDatasetName = "alberta.tcc";
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onSelectDataset(testDatasetName);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ datasetName: testDatasetName }),
        );
    });

    it("should check #selectDataset without dataset name()", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onSelectDataset();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                datasetName: mockDatasetBasicsFragment.name,
            }),
        );
    });

    it("should check click on lineage node ", () => {
        const selectDatasetSpy = spyOn(component, "onSelectDataset");
        component.onClickLineageNode(mockNode);
        expect(selectDatasetSpy).toHaveBeenCalledWith(mockNode.label);
    });

    it("should check click on metadata node ", () => {
        const selectDatasetSpy = spyOn(component, "onSelectDataset");
        component.onClickMetadataNode(mockDatasetBasicsFragment);
        expect(selectDatasetSpy).toHaveBeenCalledWith(mockDatasetBasicsFragment.name);
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

    it("should check navigate to owner view", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.showOwnerPage(mockDatasetBasicsFragment.owner.name);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(mockDatasetBasicsFragment.owner.name);
    });
});
