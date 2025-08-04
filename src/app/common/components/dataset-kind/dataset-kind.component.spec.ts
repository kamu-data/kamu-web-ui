/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetKindComponent } from "./dataset-kind.component";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";

describe("DatasetKindComponent", () => {
    let component: DatasetKindComponent;
    let fixture: ComponentFixture<DatasetKindComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DatasetKindComponent],
        });
        fixture = TestBed.createComponent(DatasetKindComponent);
        component = fixture.componentInstance;
        component.kind = DatasetKind.Root;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
