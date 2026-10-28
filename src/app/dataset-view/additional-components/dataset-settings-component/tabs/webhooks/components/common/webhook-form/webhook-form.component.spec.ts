/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NonNullableFormBuilder, Validators } from "@angular/forms";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { urlValidator } from "@common/validation/url.validators";

import { WebhookFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/common/webhook-form/webhook-form.component";
import { WebhookFormHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/common/webhook-form/webhook-form.harness";

describe("WebhookFormComponent", () => {
    let component: WebhookFormComponent;
    let fixture: ComponentFixture<WebhookFormComponent>;
    let fb: NonNullableFormBuilder;

    const EVENT_TYPE = { name: "Dataset Updated", value: "DATASET.REF.UPDATED" };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WebhookFormComponent],
        });
        fixture = TestBed.createComponent(WebhookFormComponent);
        fb = TestBed.inject(NonNullableFormBuilder);
        component = fixture.componentInstance;
        setComponentInput(
            fixture,
            "createOrEditSubscriptionForm",
            fb.group({
                targetUrl: fb.control("", [Validators.required, urlValidator(["https"])]),
                eventTypes: fb.control<string[]>([], [Validators.required]),
                label: fb.control("", [Validators.maxLength(100)]),
            }),
        );
        setComponentInput(fixture, "dropdownList", [EVENT_TYPE]);
        fixture.detectChanges();
    });

    function webhookFormHarness(): Promise<WebhookFormHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, WebhookFormHarness);
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should show no errors before the fields are touched", async () => {
        const form = await webhookFormHarness();

        expect(await form.getTargetUrlError()).toBeNull();
        expect(await form.getEventTypesError()).toBeNull();
        expect(await form.getLabelError()).toBeNull();
    });

    it("should put the entered values into the form", async () => {
        const form = await webhookFormHarness();

        await form.setTargetUrl("  https://example.com/hook  ");
        await form.selectEventType(EVENT_TYPE.value);
        await form.setLabel("  my-hook ");

        expect(component.createOrEditSubscriptionForm.getRawValue()).toEqual({
            targetUrl: "https://example.com/hook",
            eventTypes: [EVENT_TYPE.value],
            label: "my-hook",
        });
        expect(await form.getEventTypesError()).toBeNull();
        expect(component.createOrEditSubscriptionForm.valid).toBe(true);
    });

    it("should make the fields read-only when disabled", async () => {
        setComponentInput(fixture, "disabled", true);
        const form = await webhookFormHarness();

        expect(await form.isReadonly()).toBe(true);
    });
});
