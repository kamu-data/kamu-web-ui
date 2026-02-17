/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { DataAccessLinkTabComponent } from "src/app/data-access-panel/data-access-modal/tabs/data-access-link-tab/data-access-link-tab.component";
import { mockDatasetEndPoints } from "src/app/data-access-panel/data-access-panel-mock.data";

import {
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
} from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";

describe("DataAccessLinkTabComponent", () => {
    let component: DataAccessLinkTabComponent;
    let fixture: ComponentFixture<DataAccessLinkTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DataAccessLinkTabComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessLinkTabComponent);
        component = fixture.componentInstance;
        component.webLink = mockDatasetEndPoints.webLink;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should copy to clipboard", fakeAsync(() => {
        const copyToClipboardButton = getElementByDataTestId(fixture, "copyToClipboard-clipboardReference");
        emitClickOnElementByDataTestId(fixture, "copyToClipboard-clipboardReference");
        expect(copyToClipboardButton.classList.contains("clipboard-btn--success")).toEqual(true);

        tick(AppValues.LONG_DELAY_MS);

        expect(copyToClipboardButton.classList.contains("clipboard-btn--success")).toEqual(false);

        flush();
    }));
});
