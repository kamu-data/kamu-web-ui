/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockDatasetEndPoints } from "../../../data-access-panel-mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataAccessOdataTabComponent } from "./data-access-odata-tab.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { CopyToClipboardModule } from "src/app/common/components/copy-to-clipboard/copy-to-clipboard.module";

describe("DataAccessOdataTabComponent", () => {
    let component: DataAccessOdataTabComponent;
    let fixture: ComponentFixture<DataAccessOdataTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataAccessOdataTabComponent],
            imports: [FormsModule, MatDividerModule, MatIconModule, HttpClientTestingModule, CopyToClipboardModule],
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
