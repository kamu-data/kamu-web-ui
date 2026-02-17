/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataAccessRestTabComponent } from "src/app/data-access-panel/data-access-modal/tabs/data-access-rest-tab/data-access-rest-tab.component";
import { mockDatasetEndPoints } from "src/app/data-access-panel/data-access-panel-mock.data";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";

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
