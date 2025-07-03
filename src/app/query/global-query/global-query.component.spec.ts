/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GlobalQueryComponent } from "./global-query.component";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideToastr } from "ngx-toastr";
import { SqlQueryService } from "src/app/services/sql-query.service";
import { of } from "rxjs";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { NavigationService } from "src/app/services/navigation.service";
import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";
import { mockEngines } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";

describe("GlobalQueryComponent", () => {
    let component: GlobalQueryComponent;
    let fixture: ComponentFixture<GlobalQueryComponent>;
    let sqlQueryService: SqlQueryService;
    let navigationService: NavigationService;
    let engineService: EngineService;
    const SQL_QUERY = "select * from 'datasetName'";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, SharedTestModule, GlobalQueryComponent],
            providers: [Apollo, provideToastr()],
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
