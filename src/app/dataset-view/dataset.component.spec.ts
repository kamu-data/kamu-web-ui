import { mockDatasetBasicsFragment, mockNode } from "./../search/mock.data";
import { AppDatasetService } from "./dataset.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
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
import {
    routerMock,
    routerMockEventSubject,
} from "../common/base-test.helpers.spec";

describe("DatasetComponent", () => {
    let component: DatasetComponent;
    let fixture: ComponentFixture<DatasetComponent>;
    let appDatasetService: AppDatasetService;
    let navigationService: NavigationService;
    let route: ActivatedRoute;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [ApolloModule, ApolloTestingModule, RouterTestingModule],
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
        appDatasetService = TestBed.inject(AppDatasetService);
        route = TestBed.inject(ActivatedRoute);
        navigationService = TestBed.inject(NavigationService);
        fixture.detectChanges();
    });

    it("should create", async () => {
        await expect(component).toBeTruthy();
    });

    [
        DatasetViewTypeEnum.Overview,
        DatasetViewTypeEnum.Data,
        DatasetViewTypeEnum.Metadata,
        DatasetViewTypeEnum.History,
        DatasetViewTypeEnum.Lineage,
        DatasetViewTypeEnum.Discussions,
    ].forEach((tab: string) => {
        it(`should check init ${tab} tab`, async () => {
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
            await expect(component.datasetBasics).toBe(
                mockDatasetBasicsFragment,
            );
        });
    });

    it("should check call getMainDataByLineageNode", async () => {
        const getMainDataByLineageNodeSpy = spyOn(
            component,
            "getMainDataByLineageNode",
        );
        routerMockEventSubject.next(new NavigationEnd(1, "", "redirectUrl"));
        await expect(getMainDataByLineageNodeSpy).toHaveBeenCalledTimes(1);
    });

    it("should check toggle readme view", async () => {
        component.isMarkdownEditView = false;
        component.toggleReadmeView();
        await expect(component.isMarkdownEditView).toBe(true);
        component.toggleReadmeView();
        await expect(component.isMarkdownEditView).toBe(false);
    });

    it("should check run SQL request", async () => {
        const sqlQuery = "select * from test.table";
        const requestDatasetDataSqlRunSpy = spyOn(
            appDatasetService,
            "requestDatasetDataSqlRun",
        ).and.returnValue(of());
        component.onRunSQLRequest(sqlQuery);
        await expect(requestDatasetDataSqlRunSpy).toHaveBeenCalled();
    });

    it("should check page changed", () => {
        const testPageNumber = 2;
        const navigateToDatasetViewSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.onPageChange({ currentPage: testPageNumber, isClick: false });
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ page: testPageNumber }),
        );
    });

    it("should check #selectDataset with dataset name()", () => {
        const testDatasetName = "alberta.tcc";
        const navigateToDatasetViewSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.onSelectDataset(testDatasetName);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ datasetName: testDatasetName }),
        );
    });

    it("should check #selectDataset without dataset name()", () => {
        const navigateToDatasetViewSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.onSelectDataset();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                datasetName: mockDatasetBasicsFragment.name as string,
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
        expect(selectDatasetSpy).toHaveBeenCalledWith(
            mockDatasetBasicsFragment.name,
        );
    });

    it("should check navigate to overview tab", async () => {
        const selectDatasetSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.getDatasetNavigation().navigateToOverview();
        await expect(selectDatasetSpy).toHaveBeenCalled();
    });

    it("should check navigate to data tab", () => {
        const selectDatasetSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.getDatasetNavigation().navigateToData();
        expect(selectDatasetSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ tab: DatasetViewTypeEnum.Data }),
        );
    });

    it("should check navigate to metadata tab", () => {
        const selectDatasetSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.getDatasetNavigation().navigateToMetadata(1);
        expect(selectDatasetSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ tab: DatasetViewTypeEnum.Metadata }),
        );
    });

    it("should check navigate to history tab", () => {
        const selectDatasetSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.getDatasetNavigation().navigateToHistory(1);
        expect(selectDatasetSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ tab: DatasetViewTypeEnum.History }),
        );
    });

    it("should check navigate to lineage tab", () => {
        const selectDatasetSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.getDatasetNavigation().navigateToLineage();
        expect(selectDatasetSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ tab: DatasetViewTypeEnum.Lineage }),
        );
    });

    it("should check navigate to discussions tab", async () => {
        const selectDatasetSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.getDatasetNavigation().navigateToDiscussions();
        await expect(selectDatasetSpy).not.toHaveBeenCalled(); // TODO: implement discussions
    });

    it("should check navigate to owner view", () => {
        const navigateToOwnerViewSpy = spyOn(
            navigationService,
            "navigateToOwnerView",
        );
        component.showOwnerPage();
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            mockDatasetBasicsFragment.owner.name,
        );
    });
});
