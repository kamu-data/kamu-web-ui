/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataAccessCodeTabComponent } from "src/app/data-access-panel/data-access-modal/tabs/data-access-code-tab/data-access-code-tab.component";

describe("DataAccessCodeTabComponent", () => {
    let component: DataAccessCodeTabComponent;
    let fixture: ComponentFixture<DataAccessCodeTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DataAccessCodeTabComponent],
        });
        fixture = TestBed.createComponent(DataAccessCodeTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
