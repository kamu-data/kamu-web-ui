/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockDatasetEndPoints } from "../../../data-access-panel-mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessRestTabComponent } from "./data-access-rest-tab.component";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("DataAccessRestTabComponent", () => {
    let component: DataAccessRestTabComponent;
    let fixture: ComponentFixture<DataAccessRestTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DataAccessRestTabComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessRestTabComponent);
        component = fixture.componentInstance;
        component.rest = mockDatasetEndPoints.rest;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
