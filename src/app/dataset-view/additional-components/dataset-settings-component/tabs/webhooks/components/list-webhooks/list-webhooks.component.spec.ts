/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { ModalService } from "@common/components/modal/modal.service";
import { requireValue } from "@common/helpers/app.helpers";
import { registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { WebhookSubscriptionStatus } from "@api/kamu.graphql.interface";
import { mockDatasetWebhookByIdQuery } from "@api/mock/webhooks.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { ListWebhooksComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/list-webhooks/list-webhooks.component";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("ListWebhooksComponent", () => {
    let component: ListWebhooksComponent;
    let fixture: ComponentFixture<ListWebhooksComponent>;
    let navigationService: NavigationService;
    let datasetWebhooksService: DatasetWebhooksService;
    let modalService: ModalService;
    const MOCK_SUBSCRIPTION_ID = "swdsa-sasdsacc-2123s-2112assa";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ListWebhooksComponent, SharedTestModule],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(ListWebhooksComponent);
        navigationService = TestBed.inject(NavigationService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        modalService = TestBed.inject(ModalService);
        component = fixture.componentInstance;
        setComponentInput(fixture, "webhooksViewData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            subscriptions: [],
        });

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check datasetBasics getter", () => {
        expect(component.datasetBasics).toEqual(mockDatasetBasicsRootFragment);
    });

    it("should check to create webhook", () => {
        const navigateToWebhooksSpy = vi.spyOn(navigationService, "navigateToWebhooks").mockImplementation(() => {});
        component.createWebhook();
        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
        expect(navigateToWebhooksSpy).toHaveBeenCalledWith({
            accountName: component.datasetBasics.owner.accountName,
            datasetName: component.datasetBasics.name,
            tab: ProjectLinks.URL_WEBHOOK_NEW,
        });
    });

    it("should check to remove webhook subcription", () => {
        const datasetWebhookRemoveSubscriptionSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookRemoveSubscription")
            .mockReturnValue(of(true));
        const modalWindowSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
        component.removeWebhook(MOCK_SUBSCRIPTION_ID);
        expect(datasetWebhookRemoveSubscriptionSpy).toHaveBeenCalledTimes(1);
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to rotate secret", () => {
        const navigateToWebhooksSpy = vi.spyOn(navigationService, "navigateToWebhooks").mockReturnValue();
        const modalWindowSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
        component.rotateSecret(MOCK_SUBSCRIPTION_ID);
        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to pause webhook subcription", () => {
        const datasetWebhookPauseSubscriptionSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription")
            .mockReturnValue(of(true));

        component.pauseWebhook(MOCK_SUBSCRIPTION_ID);
        expect(datasetWebhookPauseSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to resume webhook subcription", () => {
        const datasetWebhookResumeSubscriptionSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookResumeSubscription")
            .mockReturnValue(of(true));

        component.resumeWebhook(MOCK_SUBSCRIPTION_ID);
        expect(datasetWebhookResumeSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to reactivate webhook subcription", () => {
        const datasetWebhookReactivateSubscriptionSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookReactivateSubscription")
            .mockReturnValue(of(true));
        const modalWindowSpy = vi
            .spyOn(modalService, "warning")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });

        component.reactivateWebhook(MOCK_SUBSCRIPTION_ID);
        expect(datasetWebhookReactivateSubscriptionSpy).toHaveBeenCalledTimes(1);
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
    });

    it("should check status badge otions", () => {
        expect(component.webhookStatusBadgeOptions(WebhookSubscriptionStatus.Enabled)).toEqual({
            iconName: "check_circle",
            className: "status-enabled",
        });
    });

    it("should check to edit subscription", () => {
        const mockWebhookSubscription = requireValue(mockDatasetWebhookByIdQuery.datasets.byId?.webhooks.subscription);
        const navigateToWebhooksSpy = vi.spyOn(navigationService, "navigateToWebhooks").mockImplementation(() => {});
        component.editWebhook(mockWebhookSubscription);
        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
        expect(navigateToWebhooksSpy).toHaveBeenCalledWith({
            accountName: component.datasetBasics.owner.accountName,
            datasetName: component.datasetBasics.name,
            tab: mockWebhookSubscription.id,
        });
    });
});
