/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderFieldComponent } from "./order-field.component";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { SourceOrder } from "../../source-events/add-polling-source/process-form.service.types";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("OrderFieldComponent", () => {
    let component: OrderFieldComponent;
    let fixture: ComponentFixture<OrderFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NgbTooltipModule,
                ReactiveFormsModule,
                FormsModule,
                SharedTestModule,
                OrderFieldComponent,
                TooltipIconComponent,
            ],
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
