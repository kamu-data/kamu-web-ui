/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { provideToastr } from "ngx-toastr";

import { mockSetDataSchema } from "../../mock.events";
import { SetDataSchemaEventComponent } from "./set-data-schema-event.component";

describe("SetDataSchemaEventComponent", () => {
    let component: SetDataSchemaEventComponent;
    let fixture: ComponentFixture<SetDataSchemaEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SetDataSchemaEventComponent],
            providers: [provideToastr()],
        }).compileComponents();

        fixture = TestBed.createComponent(SetDataSchemaEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetDataSchema;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
