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
import { DataAccessKamuCliTabComponent } from "./data-access-kamu-cli-tab.component";

describe("DataAccessKamuCliTabComponent", () => {
    let component: DataAccessKamuCliTabComponent;
    let fixture: ComponentFixture<DataAccessKamuCliTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DataAccessKamuCliTabComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessKamuCliTabComponent);
        component = fixture.componentInstance;
        component.cli = mockDatasetEndPoints.cli;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
