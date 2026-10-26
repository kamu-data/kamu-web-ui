/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { SetDataSchemaEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-data-schema-event/set-data-schema-event.component";
import { mockSetDataSchema } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

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
        setComponentInput(fixture, "event", mockSetDataSchema);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
