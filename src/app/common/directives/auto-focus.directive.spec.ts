/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApplicationRef, ChangeDetectionStrategy, Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { findNativeElement } from "@common/helpers/base-test.helpers.spec";

import { AutoFocusDirective } from "./auto-focus.directive";

@Component({
    template: `<input appAutofocus data-test-id="autofocus-input" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AutoFocusDirective],
})
class TestHostComponent {}

describe("AutoFocusDirective", () => {
    it("should focus the element once it is rendered", () => {
        const fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        TestBed.inject(ApplicationRef).tick();

        const input = findNativeElement(fixture, `[data-test-id="autofocus-input"]`);
        expect(document.activeElement).toBe(input);
    });
});
