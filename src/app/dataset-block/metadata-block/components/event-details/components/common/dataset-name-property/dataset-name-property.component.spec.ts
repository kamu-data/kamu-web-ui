/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetNamePropertyComponent } from "./dataset-name-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("DatasetNamePropertyComponent", () => {
    let component: DatasetNamePropertyComponent;
    let fixture: ComponentFixture<DatasetNamePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, DatasetNamePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetNamePropertyComponent);
        component = fixture.componentInstance;
        component.data = { datasetName: "test", ownerAccountName: "testOwner" };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
