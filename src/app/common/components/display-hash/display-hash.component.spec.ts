/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr, ToastrService } from "ngx-toastr";
import { mockDatasetInfo } from "src/app/search/mock.data";

import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import {
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { TEST_BLOCK_HASH } from "@api/mock/dataset.mock";

describe("DisplayHashComponent", () => {
    let component: DisplayHashComponent;
    let fixture: ComponentFixture<DisplayHashComponent>;
    let toastService: ToastrService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, DisplayHashComponent],
            providers: [provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
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
