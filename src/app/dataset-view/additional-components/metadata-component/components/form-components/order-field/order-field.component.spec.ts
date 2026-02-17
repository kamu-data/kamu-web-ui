/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroup } from "@angular/forms";

import { OrderFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/order-field/order-field.component";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

describe("OrderFieldComponent", () => {
    let component: OrderFieldComponent;
    let fixture: ComponentFixture<OrderFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, OrderFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({});
        component.controlName = "order";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check switch control", () => {
        expect(component.form.value).toEqual({ order: SourceOrder.NONE });

        emitClickOnElementByDataTestId(fixture, `radio-${SourceOrder.BY_NAME}-control`);
        expect(component.form.value).toEqual({ order: SourceOrder.BY_NAME });

        emitClickOnElementByDataTestId(fixture, `radio-${SourceOrder.BY_EVENT_TIME}-control`);
        expect(component.form.value).toEqual({
            order: SourceOrder.BY_EVENT_TIME,
        });
    });
});
