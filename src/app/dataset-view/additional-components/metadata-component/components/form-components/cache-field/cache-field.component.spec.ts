/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { getElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { CacheFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/cache-field/cache-field.component";

describe("CacheFieldComponent", () => {
    let component: CacheFieldComponent;
    let fixture: ComponentFixture<CacheFieldComponent>;
    const dataTestId = "cache-control";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, CacheFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CacheFieldComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "controlName", "cache");
        setComponentInput(fixture, "form", new FormGroup({ cache: new FormControl(false) }));
        setComponentInput(fixture, "dataTestId", dataTestId);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check checked and unchecked value", () => {
        const cacheCheckbox = getElementByDataTestId(fixture, "cache-control", HTMLInputElement);
        const onCheckedCacheSpy = vi.spyOn(component, "onCheckedCache");

        cacheCheckbox.click();
        expect(onCheckedCacheSpy).toHaveBeenCalledTimes(1);
        expect(component.form.controls.cache).toBeDefined();

        cacheCheckbox.click();
        expect(onCheckedCacheSpy).toHaveBeenCalledTimes(2);
        expect(component.form.controls.cache).toBeUndefined();
    });
});
