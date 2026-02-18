/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";

import { SharedTestModule } from "@common/modules/shared-test.module";

import { SchemaPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/schema-property/schema-property.component";

describe("SchemaPropertyComponent", () => {
    let component: SchemaPropertyComponent;
    let fixture: ComponentFixture<SchemaPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SchemaPropertyComponent],
            providers: [provideToastr()],
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
