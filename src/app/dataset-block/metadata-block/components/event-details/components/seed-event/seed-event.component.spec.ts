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
import {
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
} from "src/app/common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

import { mockSeed } from "../../mock.events";
import { SeedEventComponent } from "./seed-event.component";

describe("SeedEventComponent", () => {
    let component: SeedEventComponent;
    let fixture: ComponentFixture<SeedEventComponent>;
    let toastService: ToastrService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SeedEventComponent],
            providers: [provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(SeedEventComponent);
        toastService = TestBed.inject(ToastrService);
        component = fixture.componentInstance;
        component.event = mockSeed;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check copyToClipboard button is exist", () => {
        const copyToClipboardButton = getElementByDataTestId(fixture, "copyToClipboardId");
        expect(copyToClipboardButton).toBeDefined();
    });

    it("should check copyToClipboard button is work", () => {
        const successToastServiceSpy = spyOn(toastService, "success");
        emitClickOnElementByDataTestId(fixture, "copyToClipboardId");
        expect(successToastServiceSpy).toHaveBeenCalledWith("Copied");
    });
});
