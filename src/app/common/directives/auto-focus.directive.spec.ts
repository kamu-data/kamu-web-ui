/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ElementRef, EnvironmentInjector, runInInjectionContext } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { AutoFocusDirective } from "./auto-focus.directive";

describe("AutoFocusDirective", () => {
    it("should create an instance", () => {
        TestBed.configureTestingModule({
            providers: [{ provide: ElementRef, useValue: new ElementRef(document.createElement("input")) }],
        });
        const directive = runInInjectionContext(
            TestBed.inject(EnvironmentInjector),
            () => new AutoFocusDirective(),
        );
        expect(directive).toBeTruthy();
    });
});
