/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Location } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NEVER, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import { setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { WebhookSubscriptionStatus } from "@api/kamu.graphql.interface";

import { AppConfigService } from "src/app/app-config.service";
import { WebhookFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/common/webhook-form/webhook-form.component";
import { EditWebhookComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/edit-webhook.component";
import { EditWebhookHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/edit-webhook.harness";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("EditWebhookComponent", () => {
    let component: EditWebhookComponent;
    let fixture: ComponentFixture<EditWebhookComponent>;
    let datasetWebhooksService: DatasetWebhooksService;
    let navigationService: NavigationService;
    let location: Location;
    let loopbackTargetsOnlySpy: Mock<() => boolean>;

    const SUBSCRIPTION_ID = "112-32323-3232-323";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [EditWebhookComponent, WebhookFormComponent, SharedTestModule],
        });
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        navigationService = TestBed.inject(NavigationService);
        location = TestBed.inject(Location);
        loopbackTargetsOnlySpy = vi
            .spyOn(TestBed.inject(AppConfigService), "webhookLoopbackTargetsOnly", "get")
            .mockReturnValue(false);
        createComponent("https://mock.com");
    });

    function createComponent(targetUrl: string): void {
        fixture = TestBed.createComponent(EditWebhookComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "editWebhooksData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            subscription: {
                __typename: "WebhookSubscription",
                targetUrl,
                status: WebhookSubscriptionStatus.Enabled,
                eventTypes: ["DATASET.REF.UPDATED"],
                id: SUBSCRIPTION_ID,
                label: "",
            },
        });
        fixture.detectChanges();
    }

    function editWebhookHarness(): Promise<EditWebhookHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, EditWebhookHarness);
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should fill the form from the subscription", async () => {
        const page = await editWebhookHarness();
        const form = await page.getForm();

        expect(await form.getTargetUrl()).toBe("https://mock.com");
        expect(await form.getSelectedEventTypes()).toEqual(["Dataset Updated"]);
        expect(await form.getLabel()).toBe("");
    });

    it("should update the webhook with the edited fields and go back", async () => {
        const backSpy = stubMethod(location, "back");
        const updateSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookUpdateSubscription")
            .mockReturnValue(of({ ok: true, value: true }));
        const page = await editWebhookHarness();
        const form = await page.getForm();

        await form.setTargetUrl("https://example.com/new-hook");
        await form.setLabel("renamed");
        await page.submit();

        expect(updateSpy).toHaveBeenCalledWith({
            datasetId: mockDatasetBasicsRootFragment.id,
            id: SUBSCRIPTION_ID,
            input: {
                targetUrl: "https://example.com/new-hook",
                eventTypes: ["DATASET.REF.UPDATED"],
                label: "renamed",
            },
        });
        expect(backSpy).toHaveBeenCalledTimes(1);
    });

    [
        { url: "", message: "Target URL is required" },
        { url: "http://example.com", message: "Target URL must be a URL starting with https://" },
    ].forEach(({ url, message }) => {
        it(`should not update the webhook with the target URL "${url}"`, async () => {
            const updateSpy = vi.spyOn(datasetWebhooksService, "datasetWebhookUpdateSubscription");
            const page = await editWebhookHarness();
            const form = await page.getForm();

            await form.setTargetUrl(url);
            expect(await form.getTargetUrlError()).toBe(message);
            expect(await page.isSubmitDisabled()).toBe(true);
            await page.submit();

            expect(updateSpy).not.toHaveBeenCalled();
        });
    });

    describe("against a node that accepts only loopback targets", () => {
        beforeEach(() => {
            fixture.destroy();
            loopbackTargetsOnlySpy.mockReturnValue(true);
            createComponent("http://localhost:8080/hook");
        });

        it("should update a webhook whose target URL is an http URL", async () => {
            stubMethod(location, "back");
            const updateSpy = vi
                .spyOn(datasetWebhooksService, "datasetWebhookUpdateSubscription")
                .mockReturnValue(of({ ok: true, value: true }));
            const page = await editWebhookHarness();
            const form = await page.getForm();

            await form.setLabel("renamed");
            expect(await form.getTargetUrlError()).toBeNull();
            expect(await page.isSubmitDisabled()).toBe(false);
            await page.submit();

            expect(updateSpy).toHaveBeenCalledWith({
                datasetId: mockDatasetBasicsRootFragment.id,
                id: SUBSCRIPTION_ID,
                input: {
                    targetUrl: "http://localhost:8080/hook",
                    eventTypes: ["DATASET.REF.UPDATED"],
                    label: "renamed",
                },
            });
        });

        it("should reject a target URL that is not an HTTP or HTTPS URL", async () => {
            const page = await editWebhookHarness();
            const form = await page.getForm();

            await form.setTargetUrl("ftp://localhost/hook");

            expect(await form.getTargetUrlError()).toBe("Target URL must be a URL starting with http://, https://");
            expect(await page.isSubmitDisabled()).toBe(true);
        });
    });

    it("should not update the webhook with a label over 100 characters", async () => {
        const page = await editWebhookHarness();
        const form = await page.getForm();

        await form.setLabel("l".repeat(101));

        expect(await form.getLabelError()).toBe("Label can't exceed 100 characters");
        expect(await page.isSubmitDisabled()).toBe(true);
    });

    [
        { field: "label" as const, message: "Label must be unique" },
        { field: "targetUrl" as const, message: "Target URL is not reachable" },
    ].forEach(({ field, message }) => {
        it(`should show the error the server returns for the ${field} under that field`, async () => {
            const backSpy = stubMethod(location, "back");
            vi.spyOn(datasetWebhooksService, "datasetWebhookUpdateSubscription").mockReturnValue(
                of({ ok: false, fieldError: { field, message } }),
            );
            const page = await editWebhookHarness();
            const form = await page.getForm();

            await page.submit();

            const error = field === "label" ? form.getLabelError() : form.getTargetUrlError();
            expect(await error).toBe(message);
            expect(await page.isSubmitDisabled()).toBe(true);
            expect(backSpy).not.toHaveBeenCalled();
        });
    });

    it("should accept a label of 100 characters", async () => {
        const page = await editWebhookHarness();
        const form = await page.getForm();

        await form.setLabel("l".repeat(100));

        expect(await form.getLabelError()).toBeNull();
        expect(await page.isSubmitDisabled()).toBe(false);
    });

    it("should clear the server error once the field is edited", async () => {
        vi.spyOn(datasetWebhooksService, "datasetWebhookUpdateSubscription").mockReturnValue(
            of({ ok: false, fieldError: { field: "label", message: "Label must be unique" } }),
        );
        const page = await editWebhookHarness();
        const form = await page.getForm();
        await page.submit();

        await form.setLabel("another-hook");

        expect(await form.getLabelError()).toBeNull();
        expect(await page.isSubmitDisabled()).toBe(false);
    });

    it("should stay on the form without a field error when the backend rejects the update for no field", async () => {
        const backSpy = stubMethod(location, "back");
        vi.spyOn(datasetWebhooksService, "datasetWebhookUpdateSubscription").mockReturnValue(
            of({ ok: false, fieldError: null }),
        );
        const page = await editWebhookHarness();
        const form = await page.getForm();

        await page.submit();

        expect(backSpy).not.toHaveBeenCalled();
        expect(await form.getTargetUrlError()).toBeNull();
        expect(await form.getLabelError()).toBeNull();
        expect(await page.isSubmitDisabled()).toBe(false);
    });

    it("should go back without saving on cancel", async () => {
        const backSpy = stubMethod(location, "back");
        const updateSpy = vi.spyOn(datasetWebhooksService, "datasetWebhookUpdateSubscription");
        const page = await editWebhookHarness();

        await page.cancel();

        expect(backSpy).toHaveBeenCalledTimes(1);
        expect(updateSpy).not.toHaveBeenCalled();
    });

    it("should keep updating disabled while the subscription is being updated", async () => {
        const updateSpy = vi.spyOn(datasetWebhooksService, "datasetWebhookUpdateSubscription").mockReturnValue(NEVER);
        const page = await editWebhookHarness();

        await page.submit();
        await page.submit();

        expect(await page.isSubmitDisabled()).toBe(true);
        expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to navigate to webhooks list", () => {
        const navigateToWebhooksSpy = stubMethod(navigationService, "navigateToWebhooks");
        component.navigateToListWebhooks();
        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
    });
});
