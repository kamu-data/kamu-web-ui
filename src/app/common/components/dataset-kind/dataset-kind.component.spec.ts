/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetKindComponent } from "./dataset-kind.component";

describe("DatasetKindComponent", () => {
    let component: DatasetKindComponent;
    let fixture: ComponentFixture<DatasetKindComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DatasetKindComponent],
        });
        fixture = TestBed.createComponent(DatasetKindComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
