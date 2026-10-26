/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";

import { DataAccessRestTabComponent } from "src/app/data-access-panel/data-access-modal/tabs/data-access-rest-tab/data-access-rest-tab.component";
import { mockDatasetEndPoints } from "src/app/data-access-panel/data-access-panel-mock.data";

describe("DataAccessRestTabComponent", () => {
    let component: DataAccessRestTabComponent;
    let fixture: ComponentFixture<DataAccessRestTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DataAccessRestTabComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessRestTabComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "rest", mockDatasetEndPoints.rest);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
