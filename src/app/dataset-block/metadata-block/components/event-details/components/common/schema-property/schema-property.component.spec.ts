/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SchemaPropertyComponent } from "./schema-property.component";
import { DynamicTableComponent } from "src/app/common/components/dynamic-table/dynamic-table.component";
import { MatTableModule } from "@angular/material/table";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("SchemaPropertyComponent", () => {
    let component: SchemaPropertyComponent;
    let fixture: ComponentFixture<SchemaPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatTableModule, SharedTestModule, SchemaPropertyComponent, DynamicTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SchemaPropertyComponent);
        component = fixture.componentInstance;
        component.data = ["id BIGINT"];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
