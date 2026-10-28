/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CacheFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/cache-field/cache-field.component";
import { CacheFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/cache-field/cache-field.harness";
import { valueControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

@Component({
    imports: [CacheFieldComponent],
    template: `
        <app-cache-field [control]="control" label="Use cache" tooltip="Cache fetched data" dataTestId="fetch-cache" />
    `,
})
class TestCacheFieldHostComponent {
    public control = valueControl(false)([]);
}

describe("CacheFieldComponent", () => {
    let fixture: ComponentFixture<TestCacheFieldHostComponent>;
    let host: TestCacheFieldHostComponent;
    let harness: CacheFieldHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestCacheFieldHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestCacheFieldHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(CacheFieldHarness);
    });

    it("should render the label", async () => {
        expect(await harness.getLabel()).toBe("Use cache");
    });

    it("should check and uncheck caching", async () => {
        await harness.toggle();
        expect(await harness.isChecked()).toBe(true);
        expect(host.control.value).toBe(true);

        await harness.toggle();
        expect(await harness.isChecked()).toBe(false);
        expect(host.control.value).toBe(false);
    });
});
