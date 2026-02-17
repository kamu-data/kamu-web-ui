/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

import { mockDatasetEndPoints } from "../../../data-access-panel-mock.data";
import { DataAccessOdataTabComponent } from "./data-access-odata-tab.component";

describe("DataAccessOdataTabComponent", () => {
    let component: DataAccessOdataTabComponent;
    let fixture: ComponentFixture<DataAccessOdataTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DataAccessOdataTabComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessOdataTabComponent);
        component = fixture.componentInstance;
        component.odata = mockDatasetEndPoints.odata;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
