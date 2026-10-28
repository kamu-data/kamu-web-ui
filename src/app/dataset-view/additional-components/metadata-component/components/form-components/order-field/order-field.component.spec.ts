/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/order-field/order-field.component";
import { OrderFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/order-field/order-field.harness";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { valueControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [OrderFieldComponent],
    template: `
        <app-order-field [control]="control" label="Order" tooltip="Order of the files" dataTestId="fetch-order" />
    `,
})
class TestOrderFieldHostComponent {
    public control = valueControl(SourceOrder.NONE)([]);
}

describe("OrderFieldComponent", () => {
    let fixture: ComponentFixture<TestOrderFieldHostComponent>;
    let host: TestOrderFieldHostComponent;
    let harness: OrderFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestOrderFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestOrderFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(OrderFieldHarness);
    });

    it("should render the label and select the control's order", async () => {
        expect(await harness.getLabel()).toBe("Order");
        expect(await harness.isOrderSelected(SourceOrder.NONE)).toBe(true);
    });

    it("should write the selected order into the control", async () => {
        await harness.selectOrder(SourceOrder.BY_NAME);
        expect(host.control.value).toBe(SourceOrder.BY_NAME);

        await harness.selectOrder(SourceOrder.BY_EVENT_TIME);
        expect(host.control.value).toBe(SourceOrder.BY_EVENT_TIME);
        expect(await harness.isOrderSelected(SourceOrder.BY_NAME)).toBe(false);
    });
});
