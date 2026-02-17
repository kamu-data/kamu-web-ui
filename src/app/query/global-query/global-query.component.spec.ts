/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";
import { mockEngines } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { NavigationService } from "src/app/services/navigation.service";
import { SqlQueryService } from "src/app/services/sql-query.service";

import { GlobalQueryComponent } from "./global-query.component";

describe("GlobalQueryComponent", () => {
    let component: GlobalQueryComponent;
    let fixture: ComponentFixture<GlobalQueryComponent>;
    let sqlQueryService: SqlQueryService;
    let navigationService: NavigationService;
    let engineService: EngineService;
    const SQL_QUERY = "select * from 'datasetName'";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedTestModule, GlobalQueryComponent],
            providers: [
                Apollo,
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(GlobalQueryComponent);
        component = fixture.componentInstance;
        component.sqlQuery = SQL_QUERY;
        sqlQueryService = TestBed.inject(SqlQueryService);
        navigationService = TestBed.inject(NavigationService);
        engineService = TestBed.inject(EngineService);
        spyOn(engineService, "engines").and.returnValue(of(mockEngines));
        spyOn(navigationService, "navigateToDatasetView");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check init sql request code ", () => {
        component.ngOnInit();
        expect(component.sqlRequestCode).toEqual(SQL_QUERY);
    });

    it("should check run sql request code ", () => {
        const requestDataSqlRunSpy = spyOn(sqlQueryService, "requestDataSqlRun").and.returnValue(of());
        component.runSQLRequest({ query: SQL_QUERY });
        expect(requestDataSqlRunSpy).toHaveBeenCalledWith(jasmine.objectContaining({ query: SQL_QUERY }));
    });
});
