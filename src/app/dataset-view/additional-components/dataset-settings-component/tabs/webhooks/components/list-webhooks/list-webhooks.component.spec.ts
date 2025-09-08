/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ListWebhooksComponent } from "./list-webhooks.component";
import { Apollo } from "apollo-angular";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { provideToastr } from "ngx-toastr";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NavigationService } from "src/app/services/navigation.service";
import ProjectLinks from "src/app/project-links";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";
import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import { of } from "rxjs";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { WebhookSubscription, WebhookSubscriptionStatus } from "src/app/api/kamu.graphql.interface";
import { mockDatasetWebhookByIdQuery } from "src/app/api/mock/webhooks.mock";

describe("ListWebhooksComponent", () => {
    let component: ListWebhooksComponent;
    let fixture: ComponentFixture<ListWebhooksComponent>;
    let navigationService: NavigationService;
    let datasetWebhooksService: DatasetWebhooksService;
    let modalService: ModalService;
    const MOCK_SUBSCRIPTION_ID = "swdsa-sasdsacc-2123s-2112assa";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [ListWebhooksComponent, SharedTestModule, HttpClientTestingModule],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(ListWebhooksComponent);
        navigationService = TestBed.inject(NavigationService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        modalService = TestBed.inject(ModalService);
        component = fixture.componentInstance;
        component.webhooksViewData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            subscriptions: [],
        };

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check datasetBasics getter", () => {
        expect(component.datasetBasics).toEqual(mockDatasetBasicsRootFragment);
    });

    it("should check to create webhook", () => {
        const navigateToWebhooksSpy = spyOn(navigationService, "navigateToWebhooks");
        component.createWebhook();
        expect(navigateToWebhooksSpy).toHaveBeenCalledOnceWith({
            accountName: component.datasetBasics.owner.accountName,
            datasetName: component.datasetBasics.name,
            tab: ProjectLinks.URL_WEBHOOK_NEW,
        });
    });

    it("should check to remove webhook subcription", () => {
        const datasetWebhookRemoveSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookRemoveSubscription",
        ).and.returnValue(of(true));
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        component.removeWebhook(MOCK_SUBSCRIPTION_ID);
        expect(datasetWebhookRemoveSubscriptionSpy).toHaveBeenCalledTimes(1);
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to pause webhook subcription", () => {
        const datasetWebhookPauseSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookPauseSubscription",
        ).and.returnValue(of(true));

        component.pauseWebhook(MOCK_SUBSCRIPTION_ID);
        expect(datasetWebhookPauseSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to resume webhook subcription", () => {
        const datasetWebhookResumeSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookResumeSubscription",
        ).and.returnValue(of(true));

        component.resumeWebhook(MOCK_SUBSCRIPTION_ID);
        expect(datasetWebhookResumeSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to reactivate webhook subcription", () => {
        const datasetWebhookReactivateSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookReactivateSubscription",
        ).and.returnValue(of(true));
        const modalWindowSpy = spyOn(modalService, "warning").and.callFake((options: ModalArgumentsInterface) => {
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
        const mockWebhookSubscription = mockDatasetWebhookByIdQuery.datasets.byId?.webhooks
            .subscription as WebhookSubscription;
        const navigateToWebhooksSpy = spyOn(navigationService, "navigateToWebhooks");
        component.editWebhook(mockWebhookSubscription);
        expect(navigateToWebhooksSpy).toHaveBeenCalledOnceWith({
            accountName: component.datasetBasics.owner.accountName,
            datasetName: component.datasetBasics.name,
            tab: mockWebhookSubscription.id,
        });
    });
});
