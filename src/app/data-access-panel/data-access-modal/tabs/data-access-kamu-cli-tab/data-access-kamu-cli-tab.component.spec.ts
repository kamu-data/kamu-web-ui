/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessKamuCliTabComponent } from "./data-access-kamu-cli-tab.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { mockDatasetEndPoints } from "../../../data-access-panel-mock.data";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("DataAccessKamuCliTabComponent", () => {
    let component: DataAccessKamuCliTabComponent;
    let fixture: ComponentFixture<DataAccessKamuCliTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, DataAccessKamuCliTabComponent],
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
