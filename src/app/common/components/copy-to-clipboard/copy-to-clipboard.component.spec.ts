/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

import { CopyToClipboardComponent } from "./copy-to-clipboard.component";

describe("CopyToClipboardComponent", () => {
    let component: CopyToClipboardComponent;
    let fixture: ComponentFixture<CopyToClipboardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CopyToClipboardComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        registerMatSvgIcons();
        fixture = TestBed.createComponent(CopyToClipboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
