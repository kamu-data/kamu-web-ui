/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";

import { CacheFieldComponent } from "./cache-field.component";
import { FormControl, FormGroup } from "@angular/forms";
import { findElement } from "src/app/common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

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
        component.controlName = "cache";
        component.form = new FormGroup({ cache: new FormControl(false) });
        component.dataTestId = dataTestId;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check checked and unchecked value", fakeAsync(() => {
        const cacheCheckbox = findElement(fixture, '[data-test-id="cache-control"]');
        const onCheckedCacheSpy = spyOn(component, "onCheckedCache").and.callThrough();

        cacheCheckbox.triggerEventHandler("change", {
            target: { checked: true },
        });
        tick();
        fixture.detectChanges();
        expect(onCheckedCacheSpy).toHaveBeenCalledTimes(1);
        expect(component.form.controls.cache).toBeDefined();

        cacheCheckbox.triggerEventHandler("change", {
            target: { checked: false },
        });
        tick();
        fixture.detectChanges();
        expect(onCheckedCacheSpy).toHaveBeenCalledTimes(2);
        expect(component.form.controls.cache).toBeUndefined();
        flush();
    }));
});
