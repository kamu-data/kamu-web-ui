/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetListComponent } from "@common/components/dataset-list-component/dataset-list.component";

describe("DatasetListComponent", () => {
    let component: DatasetListComponent;
    let fixture: ComponentFixture<DatasetListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DatasetListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
