/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NonNullableFormBuilder, Validators } from "@angular/forms";

import AppValues from "@common/values/app.values";

import { WebhookFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/common/webhook-form/webhook-form.component";

describe("WebhookFormComponent", () => {
    let component: WebhookFormComponent;
    let fixture: ComponentFixture<WebhookFormComponent>;
    let fb: NonNullableFormBuilder;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WebhookFormComponent],
        });
        fixture = TestBed.createComponent(WebhookFormComponent);
        fb = TestBed.inject(NonNullableFormBuilder);
        component = fixture.componentInstance;
        component.createOrEditSubscriptionForm = fb.group({
            targetUrl: fb.control("", [Validators.required, Validators.pattern(AppValues.URL_PATTERN_ONLY_HTTPS)]),
            eventTypes: fb.control<string[]>([], [Validators.required]),
            label: fb.control("", [Validators.maxLength(100)]),
        });
        component.dropdownList = [];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
