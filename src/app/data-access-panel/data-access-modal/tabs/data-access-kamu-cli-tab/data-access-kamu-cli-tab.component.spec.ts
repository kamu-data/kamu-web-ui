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

import { DataAccessKamuCliTabComponent } from "src/app/data-access-panel/data-access-modal/tabs/data-access-kamu-cli-tab/data-access-kamu-cli-tab.component";
import { mockDatasetEndPoints } from "src/app/data-access-panel/data-access-panel-mock.data";

describe("DataAccessKamuCliTabComponent", () => {
    let component: DataAccessKamuCliTabComponent;
    let fixture: ComponentFixture<DataAccessKamuCliTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DataAccessKamuCliTabComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessKamuCliTabComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "cli", mockDatasetEndPoints.cli);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
