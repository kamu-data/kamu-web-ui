/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
} from "src/app/common/helpers/base-test.helpers.spec";
import { mockDatasetInfo } from "src/app/search/mock.data";
import { DisplayHashComponent } from "./display-hash.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { MatIconModule } from "@angular/material/icon";
import { TEST_BLOCK_HASH } from "src/app/api/mock/dataset.mock";

describe("DisplayHashComponent", () => {
    let component: DisplayHashComponent;
    let fixture: ComponentFixture<DisplayHashComponent>;
    let toastService: ToastrService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterModule,
        SharedTestModule,
        MatIconModule,
        DisplayHashComponent,
    ],
}).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DisplayHashComponent);
        toastService = TestBed.inject(ToastrService);
        component = fixture.componentInstance;
        component.value = TEST_BLOCK_HASH;
        component.navigationTargetDataset = mockDatasetInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check copyToClipboard button is exist", () => {
        component.showCopyButton = true;
        fixture.detectChanges();

        const copyToClipboardButton = getElementByDataTestId(fixture, "copyToClipboardButton");
        expect(copyToClipboardButton).toBeDefined();
    });

    it("should check copyToClipboard button is work", () => {
        const successToastServiceSpy = spyOn(toastService, "success");
        component.showCopyButton = true;
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "copyToClipboardButton");
        expect(successToastServiceSpy).toHaveBeenCalledWith("Copied");
    });

    it("should check hash length", () => {
        component.navigationTargetDataset = undefined;
        fixture.detectChanges();
        const spanElement = getElementByDataTestId(fixture, "notNavigableValue");
        expect(spanElement.textContent?.length).toEqual(8);
    });
});
