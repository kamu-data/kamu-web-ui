/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NEVER, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockCreateWebhookSubscriptionSuccess } from "@api/mock/webhooks.mock";

import { AppConfigService } from "src/app/app-config.service";
import { AddWebhookComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/add-webhook/add-webhook.component";
import { AddWebhookHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/add-webhook/add-webhook.harness";
import { WebhookFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/common/webhook-form/webhook-form.component";
import { WebhookFormHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/common/webhook-form/webhook-form.harness";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";
import { WebhooksService } from "src/app/services/webhooks.service";

describe("AddWebhookComponent", () => {
    let component: AddWebhookComponent;
    let fixture: ComponentFixture<AddWebhookComponent>;
    let webhooksService: WebhooksService;
    let datasetWebhooksService: DatasetWebhooksService;
    let navigationService: NavigationService;
    let loopbackTargetsOnlySpy: Mock<() => boolean>;

    const EVENT_TYPE = { name: "Dataset Updated", value: "DATASET.REF.UPDATED" };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [AddWebhookComponent, WebhookFormComponent, SharedTestModule],
        });
        registerMatSvgIcons();

        webhooksService = TestBed.inject(WebhooksService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        navigationService = TestBed.inject(NavigationService);
        vi.spyOn(webhooksService, "eventTypes").mockReturnValue(of([EVENT_TYPE]));
        loopbackTargetsOnlySpy = vi
            .spyOn(TestBed.inject(AppConfigService), "webhookLoopbackTargetsOnly", "get")
            .mockReturnValue(false);
        createComponent();
    });

    function createComponent(): void {
        fixture = TestBed.createComponent(AddWebhookComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
        fixture.detectChanges();
    }

    function addWebhookHarness(): Promise<AddWebhookHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, AddWebhookHarness);
    }

    async function fillValidForm(page: AddWebhookHarness): Promise<WebhookFormHarness> {
        const form = await page.getForm();
        await form.setTargetUrl("https://example.com/hook");
        await form.selectEventType(EVENT_TYPE.value);
        await form.setLabel("my-hook");
        return form;
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should require a target URL", async () => {
        const page = await addWebhookHarness();
        const form = await page.getForm();

        await form.setTargetUrl("");

        expect(await form.getTargetUrlError()).toBe("Target URL is required");
    });

    ["http://example.com/hook", "example.com", "https://"].forEach((url) => {
        it(`should reject the target URL "${url}", which is not an HTTPS URL`, async () => {
            const page = await addWebhookHarness();
            const form = await page.getForm();

            await form.setTargetUrl(url);

            expect(await form.getTargetUrlError()).toBe("Target URL must be a URL starting with https://");
        });
    });

    describe("against a node that accepts only loopback targets", () => {
        beforeEach(() => {
            fixture.destroy();
            loopbackTargetsOnlySpy.mockReturnValue(true);
            createComponent();
        });

        it("should add a webhook with an http target URL", async () => {
            const createSpy = vi
                .spyOn(datasetWebhooksService, "datasetWebhookCreateSubscription")
                .mockReturnValue(of({ ok: true, value: mockCreateWebhookSubscriptionSuccess }));
            const page = await addWebhookHarness();
            const form = await fillValidForm(page);

            await form.setTargetUrl("http://localhost:8080/hook");
            expect(await form.getTargetUrlError()).toBeNull();
            await page.submit();

            expect(createSpy).toHaveBeenCalledWith(mockDatasetBasicsRootFragment.id, {
                targetUrl: "http://localhost:8080/hook",
                eventTypes: [EVENT_TYPE.value],
                label: "my-hook",
            });
        });

        it("should reject a target URL that is not an HTTP or HTTPS URL", async () => {
            const page = await addWebhookHarness();
            const form = await page.getForm();

            await form.setTargetUrl("ftp://localhost/hook");

            expect(await form.getTargetUrlError()).toBe("Target URL must be a URL starting with http://, https://");
        });
    });

    it("should require an event type", async () => {
        const page = await addWebhookHarness();
        const form = await page.getForm();

        await form.touchEventTypes();

        expect(await form.getEventTypesError()).toBe("Subscribed events is required");
    });

    it("should limit the label to 100 characters", async () => {
        const page = await addWebhookHarness();
        const form = await page.getForm();

        await form.setLabel("l".repeat(100));
        expect(await form.getLabelError()).toBeNull();

        await form.setLabel("l".repeat(101));
        expect(await form.getLabelError()).toBe("Label can't exceed 100 characters");
    });

    it("should keep adding disabled while the form is invalid", async () => {
        const createSpy = vi.spyOn(datasetWebhooksService, "datasetWebhookCreateSubscription");
        const page = await addWebhookHarness();
        const form = await fillValidForm(page);

        await form.setTargetUrl("http://example.com/hook");
        expect(await page.isSubmitDisabled()).toBe(true);
        await page.submit();

        expect(createSpy).not.toHaveBeenCalled();
    });

    it("should add a webhook with the entered fields", async () => {
        const createSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookCreateSubscription")
            .mockReturnValue(of({ ok: true, value: mockCreateWebhookSubscriptionSuccess }));
        const page = await addWebhookHarness();
        const form = await fillValidForm(page);

        expect(await form.getSelectedEventTypes()).toEqual([EVENT_TYPE.name]);
        expect(await page.isSubmitDisabled()).toBe(false);
        await page.submit();

        expect(createSpy).toHaveBeenCalledWith(mockDatasetBasicsRootFragment.id, {
            targetUrl: "https://example.com/hook",
            eventTypes: [EVENT_TYPE.value],
            label: "my-hook",
        });
        expect(await form.isReadonly()).toBe(true);
    });

    it("should keep adding disabled while the subscription is being created", async () => {
        const createSpy = vi.spyOn(datasetWebhooksService, "datasetWebhookCreateSubscription").mockReturnValue(NEVER);
        const page = await addWebhookHarness();
        await fillValidForm(page);

        await page.submit();
        await page.submit();

        expect(await page.isSubmitDisabled()).toBe(true);
        expect(createSpy).toHaveBeenCalledTimes(1);
    });

    [
        { field: "label" as const, message: "Label must be unique" },
        { field: "targetUrl" as const, message: "Target URL is not reachable" },
    ].forEach(({ field, message }) => {
        it(`should show the error the server returns for the ${field} under that field`, async () => {
            vi.spyOn(datasetWebhooksService, "datasetWebhookCreateSubscription").mockReturnValue(
                of({ ok: false, fieldError: { field, message } }),
            );
            const page = await addWebhookHarness();
            const form = await fillValidForm(page);

            await page.submit();

            const error = field === "label" ? form.getLabelError() : form.getTargetUrlError();
            expect(await error).toBe(message);
            expect(await page.isSubmitDisabled()).toBe(true);
        });
    });

    it("should clear the server error once the field is edited", async () => {
        vi.spyOn(datasetWebhooksService, "datasetWebhookCreateSubscription").mockReturnValue(
            of({ ok: false, fieldError: { field: "label", message: "Label must be unique" } }),
        );
        const page = await addWebhookHarness();
        const form = await fillValidForm(page);
        await page.submit();

        await form.setLabel("another-hook");

        expect(await form.getLabelError()).toBeNull();
        expect(await page.isSubmitDisabled()).toBe(false);
    });

    it("should keep the form editable without a field error when the backend rejects it for no field", async () => {
        vi.spyOn(datasetWebhooksService, "datasetWebhookCreateSubscription").mockReturnValue(
            of({ ok: false, fieldError: null }),
        );
        const page = await addWebhookHarness();
        const form = await fillValidForm(page);

        await page.submit();

        expect(await form.isReadonly()).toBe(false);
        expect(await form.getTargetUrlError()).toBeNull();
        expect(await form.getLabelError()).toBeNull();
        expect(await page.isSubmitDisabled()).toBe(false);
    });

    it("should check to navigate to webhooks list", () => {
        const navigateToWebhooksSpy = stubMethod(navigationService, "navigateToWebhooks");
        component.navigateToListWebhooks();
        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
    });
});
