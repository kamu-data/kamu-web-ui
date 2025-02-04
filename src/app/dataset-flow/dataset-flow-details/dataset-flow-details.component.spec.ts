import { Apollo, ApolloModule } from "apollo-angular";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { DatasetFlowDetailsComponent } from "./dataset-flow-details.component";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule } from "ngx-toastr";
import { of, shareReplay } from "rxjs";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { DatasetViewHeaderComponent } from "src/app/dataset-view/dataset-view-header/dataset-view-header.component";
import { FlowDetailsHistoryTabComponent } from "./tabs/flow-details-history-tab/flow-details-history-tab.component";
import { SearchAdditionalButtonsComponent } from "src/app/common/components/search-additional-buttons/search-additional-buttons.component";
import { SearchAdditionalButtonsNavComponent } from "src/app/common/components/search-additional-buttons/search-additional-buttons-nav.component";
import { MatMenuModule } from "@angular/material/menu";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetViewMenuComponent } from "src/app/dataset-view/dataset-view-menu/dataset-view-menu.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormsModule } from "@angular/forms";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlowDetailsTabs } from "./dataset-flow-details.types";
import ProjectLinks from "src/app/project-links";
import { mockDatasetFlowByIdResponse, mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { DataAccessPanelComponent } from "src/app/data-access-panel/data-access-panel.component";
import { DataAccessPanelModule } from "src/app/data-access-panel/data-access-panel.module";
import { DatasetVisibilityModule } from "src/app/common/components/dataset-visibility/dataset-visibility.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { FeatureFlagModule } from "src/app/common/directives/feature-flag.module";

describe("DatasetFlowDetailsComponent", () => {
    let component: DatasetFlowDetailsComponent;
    let fixture: ComponentFixture<DatasetFlowDetailsComponent>;
    let datasetFlowsService: DatasetFlowsService;
    let datasetSubsService: DatasetSubscriptionsService;
    let datasetService: DatasetService;
    let activatedRoute: ActivatedRoute;
    const MOCK_FLOW_ID = "3";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DatasetFlowDetailsComponent,
                DatasetViewHeaderComponent,
                FlowDetailsHistoryTabComponent,
                SearchAdditionalButtonsComponent,
                SearchAdditionalButtonsNavComponent,
                DatasetViewMenuComponent,
                DataAccessPanelComponent,
            ],
            providers: [
                {
                    Apollo,
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            params: of({
                                accountName: "accountName",
                                datasetName: "datasetName",
                            }),
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "tab":
                                            return "flows";
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
                                        case "flow-id":
                                            return 1;
                                        case "category":
                                            return "history";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
            imports: [
                ApolloTestingModule,
                ApolloModule,
                MatDividerModule,
                MatIconModule,
                MatMenuModule,
                MatButtonToggleModule,
                ToastrModule.forRoot(),
                HttpClientTestingModule,
                MatTabsModule,
                FormsModule,
                BrowserAnimationsModule,
                DataAccessPanelModule,
                RouterModule,
                DatasetVisibilityModule,
                FeatureFlagModule,
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetFlowDetailsComponent);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        activatedRoute = TestBed.inject(ActivatedRoute);
        component = fixture.componentInstance;
        component.flowId = "5";
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check get all data for view menu", fakeAsync(() => {
        tick();
        fixture.detectChanges();
        component.datasetViewMenuData$.pipe(shareReplay()).subscribe((data) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            });
        });
        flush();
    }));

    it(`should check extract flow id`, () => {
        activatedRoute.snapshot.params = {
            [ProjectLinks.URL_PARAM_FLOW_ID]: MOCK_FLOW_ID,
        };
        component.ngOnInit();
        expect(component.flowId).toEqual(MOCK_FLOW_ID);
    });

    it(`should check refresh flow now`, () => {
        const datasetFlowByIdSpy = spyOn(datasetFlowsService, "datasetFlowById").and.returnValue(
            of(mockDatasetFlowByIdResponse),
        );
        component.refreshNow();
        component.datasetFlowDetails$.subscribe(() => {
            expect(datasetFlowByIdSpy).toHaveBeenCalledTimes(1);
        });
    });

    it(`should check created router link`, () => {
        const expectedResult = "/accountName/datasetName/flow-details/5/history";
        expect(component.getRouteLink(FlowDetailsTabs.HISTORY)).toEqual(expectedResult);
    });

    it(`should check flow type description`, () => {
        const expectedResult = "Polling ingest";
        expect(component.flowTypeDescription(mockFlowSummaryDataFragments[0])).toEqual(expectedResult);
    });

    it(`should check end of message`, () => {
        const expectedResult = "finished";
        expect(component.descriptionDatasetFlowEndOfMessage(mockFlowSummaryDataFragments[0])).toEqual(expectedResult);
    });

    it(`should check description options`, () => {
        const expectedResult = { icon: "check_circle", class: "completed-status" };
        expect(component.descriptionColumnOptions(mockFlowSummaryDataFragments[0])).toEqual(expectedResult);
    });
});
