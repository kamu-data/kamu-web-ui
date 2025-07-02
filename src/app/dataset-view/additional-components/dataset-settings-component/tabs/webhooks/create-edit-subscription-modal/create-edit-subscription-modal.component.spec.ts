/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { CreateEditSubscriptionModalComponent } from "./create-edit-subscription-modal.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { ApolloTestingModule } from "apollo-angular/testing";
import { NgSelectModule } from "@ng-select/ng-select";
import { WebhooksService } from "src/app/services/webhooks.service";
import { of } from "rxjs";
import { WebhookSubscriptionInput, WebhookSubscriptionStatus } from "src/app/api/kamu.graphql.interface";
import { mockWebhookSubscriptionInput } from "src/app/api/mock/webhooks.mock";
import {
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
} from "src/app/common/helpers/base-test.helpers.spec";
import { WebhookSubscriptionModalAction } from "./create-edit-subscription-modal.model";
import AppValues from "src/app/common/values/app.values";

describe("CreateEditSubscriptionModalComponent", () => {
    let component: CreateEditSubscriptionModalComponent;
    let fixture: ComponentFixture<CreateEditSubscriptionModalComponent>;
    let webhooksService: WebhooksService;
    let ngbActiveModal: NgbActiveModal;

    const MOCK_SUBSCRIPTION_ID = "swdsa-sasdsacc-2123s-2112assa";
    const MOCK_SECRET = "ec37fd23ac2b9e2319f65720f93115f731be99391b4963bf14ffc7e27ff467c7";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedTestModule,
                ReactiveFormsModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                MatDividerModule,
                MatIconModule,
                NgSelectModule,
                FormsModule,
                CreateEditSubscriptionModalComponent,
            ],
            providers: [Apollo, NgbActiveModal],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(CreateEditSubscriptionModalComponent);
        webhooksService = TestBed.inject(WebhooksService);
        ngbActiveModal = TestBed.inject(NgbActiveModal);

        spyOn(webhooksService, "eventTypes").and.returnValue(
            of([{ value: "DATASET.REF.UPDATED", name: "Dataset Updated" }]),
        );
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.subscriptionData = null;
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should init form with subscription data", () => {
        component.subscriptionData = {
            secret: MOCK_SECRET,
            status: WebhookSubscriptionStatus.Enabled,
            subscriptionId: MOCK_SUBSCRIPTION_ID,
            input: mockWebhookSubscriptionInput,
        };
        fixture.detectChanges();
        expect(component.secret).toEqual(MOCK_SECRET);
    });

    it("should pass payload when create subscription", () => {
        const activeModalCloseSpy = spyOn(ngbActiveModal, "close");
        const formValue = component.createOrEditSubscriptionForm.value as WebhookSubscriptionInput;
        fixture.detectChanges();
        component.createWebhook();
        expect(activeModalCloseSpy).toHaveBeenCalledOnceWith({
            action: WebhookSubscriptionModalAction.CREATE,
            payload: formValue,
        });
    });

    it("should pass payload when update subscription", () => {
        const activeModalCloseSpy = spyOn(ngbActiveModal, "close");
        const formValue = component.createOrEditSubscriptionForm.value as WebhookSubscriptionInput;
        fixture.detectChanges();
        component.updateWebhook();
        expect(activeModalCloseSpy).toHaveBeenCalledOnceWith({
            action: WebhookSubscriptionModalAction.UPDATE,
            payload: formValue,
        });
    });

    it("should check `Verify now` button", () => {
        const activeModalCloseSpy = spyOn(ngbActiveModal, "close");
        fixture.detectChanges();
        component.verifyNow();
        expect(activeModalCloseSpy).toHaveBeenCalledOnceWith({
            action: WebhookSubscriptionModalAction.VERIFY,
        });
    });

    it("should copy to clipboard", fakeAsync(() => {
        component.subscriptionData = {
            secret: MOCK_SECRET,
            status: WebhookSubscriptionStatus.Enabled,
            subscriptionId: MOCK_SUBSCRIPTION_ID,
            input: mockWebhookSubscriptionInput,
        };
        fixture.detectChanges();
        const copyToClipboardButton = getElementByDataTestId(fixture, "copyToClipboard-secret");
        emitClickOnElementByDataTestId(fixture, "copyToClipboard-secret");
        expect(copyToClipboardButton.classList.contains("clipboard-btn--success")).toEqual(true);

        tick(AppValues.LONG_DELAY_MS);

        expect(copyToClipboardButton.classList.contains("clipboard-btn--success")).toEqual(false);

        flush();
    }));
});
