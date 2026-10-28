/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { MaybeUndefined } from "@interface/app.types";

import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";
import { mockEngines } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { GlobalQueryComponent } from "src/app/query/global-query/global-query.component";
import { NavigationService } from "src/app/services/navigation.service";
import { QueryMicroDbTrackerService } from "src/app/services/query-micro-db-tracker.service";
import { SqlQueryService } from "src/app/services/sql-query.service";

describe("GlobalQueryComponent", () => {
    let component: GlobalQueryComponent;
    let fixture: ComponentFixture<GlobalQueryComponent>;
    let sqlQueryService: SqlQueryService;
    let navigationService: NavigationService;
    let engineService: EngineService;
    let getQuerySpy: Mock<QueryMicroDbTrackerService["getQuery"]>;
    let saveQuerySpy: Mock<QueryMicroDbTrackerService["saveQuery"]>;
    const SQL_QUERY = "select * from 'datasetName'";
    const SAVED_SQL_QUERY = "select * from 'savedDatasetName'";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedTestModule, GlobalQueryComponent],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });
        sqlQueryService = TestBed.inject(SqlQueryService);
        navigationService = TestBed.inject(NavigationService);
        engineService = TestBed.inject(EngineService);
        const queryMicroDbTrackerService = TestBed.inject(QueryMicroDbTrackerService);
        getQuerySpy = vi
            .spyOn(queryMicroDbTrackerService, "getQuery")
            .mockResolvedValue({ query: SAVED_SQL_QUERY, timestamp: 0 });
        saveQuerySpy = vi.spyOn(queryMicroDbTrackerService, "saveQuery").mockResolvedValue();
        vi.spyOn(engineService, "engines").mockReturnValue(of(mockEngines));
        vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});
    });

    function createComponent(sqlQuery: MaybeUndefined<string>): void {
        fixture = TestBed.createComponent(GlobalQueryComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "sqlQuery", sqlQuery);
        fixture.detectChanges();
    }

    it("should create", () => {
        createComponent(SQL_QUERY);
        expect(component).toBeTruthy();
    });

    it("should keep the query from the URL instead of the saved one", async () => {
        createComponent(SQL_QUERY);
        await fixture.whenStable();

        expect(component.sqlRequestCode).toEqual(SQL_QUERY);
        expect(getQuerySpy).not.toHaveBeenCalled();
    });

    it("should restore the saved query when the URL has none", async () => {
        createComponent(undefined);
        await fixture.whenStable();

        expect(getQuerySpy).toHaveBeenCalledWith(AppValues.MICRO_DB_GLOBAL_QUERY_SQL);
        expect(component.sqlRequestCode).toEqual(SAVED_SQL_QUERY);
    });

    it("should check run sql request code ", () => {
        createComponent(SQL_QUERY);
        const requestDataSqlRunSpy = vi.spyOn(sqlQueryService, "requestDataSqlRun").mockReturnValue(of());
        component.runSQLRequest({ query: SQL_QUERY });
        expect(requestDataSqlRunSpy).toHaveBeenCalledWith(expect.objectContaining({ query: SQL_QUERY }));
        expect(saveQuerySpy).toHaveBeenCalledWith(AppValues.MICRO_DB_GLOBAL_QUERY_SQL, SQL_QUERY);
    });
});
