/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";

import { mockDatasetEndPoints } from "../../../data-access-panel-mock.data";
import { DataAccessRestTabComponent } from "./data-access-rest-tab.component";

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
