/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "../../../search/mock.data";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { DataComponent } from "./data.component";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import {
    mockMetadataDerivedUpdate,
    mockMetadataRootUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "../data-tabs.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { LoadMoreComponent } from "../../../query/shared/load-more/load-more.component";
import { DynamicTableModule } from "../../../common/components/dynamic-table/dynamic-table.module";
import { EditorModule } from "src/app/editor/editor.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { RequestTimerComponent } from "../../../query/shared/request-timer/request-timer.component";
import { SqlEditorComponent } from "src/app/editor/components/sql-editor/sql-editor.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { SavedQueriesSectionComponent } from "../../../query/shared/saved-queries-section/saved-queries-section.component";
import { QueryAndResultSectionsComponent } from "../../../query/shared/query-and-result-sections/query-and-result-sections.component";
import { SearchAndSchemasSectionComponent } from "src/app/query/global-query/search-and-schemas-section/search-and-schemas-section.component";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { NavigationService } from "src/app/services/navigation.service";
import { routes } from "src/app/app-routing";
import { SqlQueryService } from "src/app/services/sql-query.service";
import { of } from "rxjs";
import AppValues from "src/app/common/values/app.values";
import { ActivatedRoute } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { EngineService } from "../metadata-component/components/set-transform/components/engine-section/engine.service";
import { mockEngines } from "../metadata-component/components/set-transform/mock.data";
import { EngineSelectComponent } from "../metadata-component/components/set-transform/components/engine-section/components/engine-select/engine-select.component";

describe("DataComponent", () => {
    let component: DataComponent;
    let fixture: ComponentFixture<DataComponent>;
    let location: Location;
    let ngbModalService: NgbModal;
    let sessionStorageService: SessionStorageService;
    let navigationService: NavigationService;
    let sqlQueryService: SqlQueryService;
    let requestDataSqlRunSpy: jasmine.Spy;
    let engineService: EngineService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case ProjectLinks.URL_QUERY_PARAM_SQL_QUERY:
                                            return null;
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
            imports: [
                CdkAccordionModule,
                MatIconModule,
                MatMenuModule,
                RouterTestingModule.withRoutes(routes),
                FormsModule,
                MatDividerModule,
                DynamicTableModule,
                EditorModule,
                MatProgressBarModule,
                CdkAccordionModule,
                HttpClientModule,
                ToastrModule.forRoot(),
                DataComponent,
                SavedQueriesSectionComponent,
                QueryAndResultSectionsComponent,
                LoadMoreComponent,
                RequestTimerComponent,
                SqlEditorComponent,
                SearchAndSchemasSectionComponent,
                EngineSelectComponent,
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(DataComponent);
        location = TestBed.inject(Location);
        ngbModalService = TestBed.inject(NgbModal);
        sessionStorageService = TestBed.inject(SessionStorageService);
        navigationService = TestBed.inject(NavigationService);
        sqlQueryService = TestBed.inject(SqlQueryService);
        engineService = TestBed.inject(EngineService);
        spyOn(engineService, "engines").and.returnValue(of(mockEngines));
        spyOn(navigationService, "navigateToDatasetView");
        spyOn(navigationService, "navigateWithSqlQuery");

        component = fixture.componentInstance;
        (component.dataTabData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: {
                schema: mockMetadataRootUpdate.schema,
                content: mockOverviewDataUpdate.content,
                overview: structuredClone(mockOverviewDataUpdate.overview), // clone, as we modify this data in the tests
                size: mockOverviewDataUpdate.size,
            } as OverviewUpdate,
        }),
            (component.sqlLoading = false);
        component.sqlRequestCode = "";
        spyOn(location, "getState").and.returnValue({ start: 0, end: 100 });
        requestDataSqlRunSpy = spyOn(sqlQueryService, "requestDataSqlRun").and.returnValue(of().pipe());
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check run sql button", fakeAsync(() => {
        const setDatasetSqlCodeSpy = spyOn(sessionStorageService, "setDatasetSqlCode");
        tick();
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "runSqlQueryButton");

        expect(setDatasetSqlCodeSpy).toHaveBeenCalledTimes(2);
        flush();
    }));

    it("should check add data", () => {
        const ngbModalServiceSpy = spyOn(ngbModalService, "open").and.callThrough();

        component.addData({
            schema: mockMetadataDerivedUpdate.schema,
            content: mockOverviewDataUpdate.content,
            overview: structuredClone(mockOverviewDataUpdateNullable.overview),
            size: mockOverviewDataUpdate.size,
        } as OverviewUpdate);
        expect(ngbModalServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should check set query from session storage", () => {
        const query = "select * from 'accounts.portfolio.usd'";
        sessionStorageService.setDatasetSqlCode(query);
        component.ngOnInit();

        expect(component.sqlRequestCode).toEqual(query);
    });

    it("should check run SQL request", () => {
        const params = {
            query: "select * from test.table",
            skip: 50,
            limit: AppValues.SQL_QUERY_LIMIT,
        };

        component.onRunSQLRequest(params);
        expect(requestDataSqlRunSpy).toHaveBeenCalledWith(params);
    });
});
