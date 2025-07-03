/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { DatasetSettingsWebhooksTabComponent } from "./dataset-settings-webhooks-tab.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { DatasetWebhooksService } from "./service/dataset-webhooks.service";
import { of } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import {
    WebhookSubscriptionModalAction,
    WebhookSubscriptionModalActionResult,
} from "./create-edit-subscription-modal/create-edit-subscription-modal.model";
import { WebhookSubscriptionStatus } from "src/app/api/kamu.graphql.interface";
import { mockWebhookSubscriptionInput } from "src/app/api/mock/webhooks.mock";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";
import { TEST_DATASET_ID } from "src/app/api/mock/dataset.mock";
import { FeatureFlagDirective } from "src/app/common/directives/feature-flag.directive";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("DatasetSettingsWebhooksTabComponent", () => {
    let component: DatasetSettingsWebhooksTabComponent;
    let fixture: ComponentFixture<DatasetSettingsWebhooksTabComponent>;
    let datasetWebhooksService: DatasetWebhooksService;
    let modalService: ModalService;
    const MOCK_SUBSCRIPTION_ID = "swdsa-sasdsacc-2123s-2112assa";

    const ngbModalMock = jasmine.createSpyObj<NgbModal>("NgbModal", ["open"]);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr(), { provide: NgbModal, useValue: ngbModalMock }],
            imports: [
                SharedTestModule,
                HttpClientTestingModule,
                MatProgressBarModule,
                MatDividerModule,
                MatTableModule,
                MatIconModule,
                NgSelectModule,
                FeatureFlagDirective,
                DatasetSettingsWebhooksTabComponent,
            ],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsWebhooksTabComponent);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        modalService = TestBed.inject(ModalService);
        component = fixture.componentInstance;
        component.webhooksViewData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            subscriptions: [],
        };
        spyOn(datasetWebhooksService, "datasetWebhookSubscriptions").and.returnValue(of([]));
        ngbModalMock.open.calls.reset();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check open rotate secret modal", () => {
        component.openRotateSecretModal();
        const openModalCallsCount = ngbModalMock.open.calls.count();
        expect(openModalCallsCount).toEqual(1);
    });

    it("should create webhook subscription with succes", fakeAsync(() => {
        const modalRefMock = {
            componentInstance: {},
            result: Promise.resolve({
                action: WebhookSubscriptionModalAction.CREATE,
                payload: { eventTypes: ["DATASET.REF.UPDATED"], label: "Test", targetUrl: "https://a.com" },
            } as WebhookSubscriptionModalActionResult),
        } as NgbModalRef;
        ngbModalMock.open.and.returnValue(modalRefMock);

        const secondModalRefMock = {
            componentInstance: {},
            result: Promise.resolve({
                action: WebhookSubscriptionModalAction.CLOSE,
            } as WebhookSubscriptionModalActionResult),
        } as NgbModalRef;
        ngbModalMock.open.and.returnValues(modalRefMock, secondModalRefMock);

        const datasetWebhookCreateSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookCreateSubscription",
        ).and.returnValue(
            of({
                secret: "ec37fd23ac2b9e2319f65720f93115f731be99391b4963bf14ffc7e27ff467c7",
                status: WebhookSubscriptionStatus.Enabled,
                message: "Success",
                subscriptionId: MOCK_SUBSCRIPTION_ID,
                input: mockWebhookSubscriptionInput,
            }),
        );
        component.createWebhook();
        tick();
        tick();
        tick();
        const openModalCallsCount = ngbModalMock.open.calls.count();
        expect(datasetWebhookCreateSubscriptionSpy).toHaveBeenCalledTimes(1);
        expect(openModalCallsCount).toEqual(2);

        flush();
    }));

    it("should create webhook subscription with cancel", fakeAsync(() => {
        const modalRefMock = {
            componentInstance: {},
            result: Promise.resolve({
                action: WebhookSubscriptionModalAction.CLOSE,
            } as WebhookSubscriptionModalActionResult),
        } as NgbModalRef;
        ngbModalMock.open.and.returnValue(modalRefMock);

        const datasetWebhookCreateSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookCreateSubscription",
        ).and.returnValue(
            of({
                secret: "ec37fd23ac2b9e2319f65720f93115f731be99391b4963bf14ffc7e27ff467c7",
                status: WebhookSubscriptionStatus.Enabled,
                message: "Success",
                subscriptionId: MOCK_SUBSCRIPTION_ID,
                input: mockWebhookSubscriptionInput,
            }),
        );

        component.createWebhook();
        tick();
        tick();
        const openModalCallsCount = ngbModalMock.open.calls.count();
        expect(datasetWebhookCreateSubscriptionSpy).toHaveBeenCalledTimes(0);
        expect(openModalCallsCount).toEqual(1);

        flush();
    }));

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

    it("should check status badge otions", () => {
        expect(component.webhookStatusBadgeOptions(WebhookSubscriptionStatus.Enabled)).toEqual({
            iconName: "check_circle",
            className: "status-enabled",
        });
    });

    it("should update webhook subscription with succes", fakeAsync(() => {
        const modalRefMock = {
            componentInstance: {},
            result: Promise.resolve({
                action: WebhookSubscriptionModalAction.UPDATE,
                payload: { eventTypes: ["DATASET.REF.UPDATED"], label: "Test", targetUrl: "https://a.com" },
            } as WebhookSubscriptionModalActionResult),
        } as NgbModalRef;
        ngbModalMock.open.and.returnValue(modalRefMock);

        const datasetWebhookUpdateSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookUpdateSubscription",
        ).and.returnValue(of(true));

        component.editWebhook({
            datasetId: TEST_DATASET_ID,
            eventTypes: ["DATASET.REF.UPDATED"],
            id: MOCK_SUBSCRIPTION_ID,
            label: "Label",
            status: WebhookSubscriptionStatus.Enabled,
            targetUrl: "https://test.com",
        });
        tick();
        tick();
        const openModalCallsCount = ngbModalMock.open.calls.count();
        expect(datasetWebhookUpdateSubscriptionSpy).toHaveBeenCalledTimes(1);
        expect(openModalCallsCount).toEqual(1);

        flush();
    }));

    it("should update webhook subscription with cancel", fakeAsync(() => {
        const modalRefMock = {
            componentInstance: {},
            result: Promise.resolve({
                action: WebhookSubscriptionModalAction.CLOSE,
            } as WebhookSubscriptionModalActionResult),
        } as NgbModalRef;
        ngbModalMock.open.and.returnValue(modalRefMock);

        const datasetWebhookUpdateSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookUpdateSubscription",
        ).and.returnValue(of(false));

        component.editWebhook({
            datasetId: TEST_DATASET_ID,
            eventTypes: ["DATASET.REF.UPDATED"],
            id: MOCK_SUBSCRIPTION_ID,
            label: "Label",
            status: WebhookSubscriptionStatus.Enabled,
            targetUrl: "https://test.com",
        });
        tick();
        tick();
        const openModalCallsCount = ngbModalMock.open.calls.count();
        expect(datasetWebhookUpdateSubscriptionSpy).toHaveBeenCalledTimes(0);
        expect(openModalCallsCount).toEqual(1);

        flush();
    }));
});
