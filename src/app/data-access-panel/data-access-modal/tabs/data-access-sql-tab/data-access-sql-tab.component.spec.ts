/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataAccessSqlTabComponent } from "src/app/data-access-panel/data-access-modal/tabs/data-access-sql-tab/data-access-sql-tab.component";
import { mockDatasetEndPoints } from "src/app/data-access-panel/data-access-panel-mock.data";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";

describe("DataAccessSqlTabComponent", () => {
    let component: DataAccessSqlTabComponent;
    let fixture: ComponentFixture<DataAccessSqlTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DataAccessSqlTabComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessSqlTabComponent);
        component = fixture.componentInstance;
        component.flightSql = mockDatasetEndPoints.flightsql;
        component.jdbc = mockDatasetEndPoints.jdbc;
        component.postgreSql = mockDatasetEndPoints.postgresql;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
