/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CopyToClipboardComponent } from "./copy-to-clipboard.component";
import { MatIconModule } from "@angular/material/icon";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("CopyToClipboardComponent", () => {
    let component: CopyToClipboardComponent;
    let fixture: ComponentFixture<CopyToClipboardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatIconModule, HttpClientTestingModule, CopyToClipboardComponent],
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
