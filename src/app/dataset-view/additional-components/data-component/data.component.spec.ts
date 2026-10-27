/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Location } from "@angular/common";
import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import { emitClickOnElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";

import { DataComponent } from "src/app/dataset-view/additional-components/data-component/data.component";
import {
    mockDerivedOverviewUpdate,
    mockRootOverviewUpdate,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";
import { mockEngines } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import ProjectLinks from "src/app/project-links";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";
import { QueryMicroDbTrackerService } from "src/app/services/query-micro-db-tracker.service";
import { SqlQueryService } from "src/app/services/sql-query.service";

describe("DataComponent", () => {
    let component: DataComponent;
    let fixture: ComponentFixture<DataComponent>;
    let location: Location;
    let ngbModalService: NgbModal;
    let navigationService: NavigationService;
    let sqlQueryService: SqlQueryService;
    let requestDataSqlRunSpy: Mock;
    let engineService: EngineService;
    let queryMicriDbTrackerService: QueryMicroDbTrackerService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DataComponent],
            providers: [
                Apollo,
                provideToastr(),
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
                provideHttpClient(),
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(DataComponent);
        location = TestBed.inject(Location);
        ngbModalService = TestBed.inject(NgbModal);
        navigationService = TestBed.inject(NavigationService);
        sqlQueryService = TestBed.inject(SqlQueryService);
        engineService = TestBed.inject(EngineService);
        queryMicriDbTrackerService = TestBed.inject(QueryMicroDbTrackerService);
        vi.spyOn(engineService, "engines").mockReturnValue(of(mockEngines));
        vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});
        vi.spyOn(navigationService, "navigateWithSqlQuery").mockImplementation(() => {});

        component = fixture.componentInstance;
        setComponentInput(fixture, "dataTabData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockRootOverviewUpdate,
        });
        component.sqlLoading = false;
        requestDataSqlRunSpy = vi.spyOn(sqlQueryService, "requestDataSqlRun").mockReturnValue(of().pipe());
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check run sql button", fakeAsync(() => {
        const getQuerySpy = vi.spyOn(queryMicriDbTrackerService, "getQuery").mockResolvedValue({
            query: "select * from 'test.table'",
            timestamp: 121223224,
        });

        tick();
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "runSqlQueryButton");

        flush();

        expect(getQuerySpy).toHaveBeenCalledTimes(1);
        expect(component.sqlRequestCode).toEqual("select * from 'test.table'");
    }));

    it("should check add data", () => {
        const ngbModalServiceSpy = vi.spyOn(ngbModalService, "open");

        component.addData(mockDerivedOverviewUpdate);
        expect(ngbModalServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("should check set query from microDB", async () => {
        const mockQuery = "select * from 'kamu/mockNameRoot'";
        const mockEntry = {
            query: mockQuery,
            timestamp: Date.now(),
        };
        await queryMicriDbTrackerService.saveQuery("kamu/mockNameRoot", mockQuery);

        vi.spyOn(queryMicriDbTrackerService, "getQuery").mockResolvedValue(mockEntry);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.sqlRequestCode).toEqual(mockQuery);
    });

    it("should check set query with offset", async () => {
        vi.spyOn(location, "getState").mockReturnValue({ start: "0", end: "100" });
        const mockQuery = "select * from 'kamu/mockNameRoot'";
        const mockEntry = {
            query: mockQuery,
            timestamp: Date.now(),
        };

        vi.spyOn(queryMicriDbTrackerService, "getQuery").mockResolvedValue(mockEntry);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.sqlRequestCode).toEqual(
            "select\n  *\nfrom 'kamu/mockNameRoot'" + "\nwhere offset>=0 and offset<=100\norder by offset desc",
        );
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
