/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddWebhookComponent } from "./add-webhook.component";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { WebhooksService } from "src/app/services/webhooks.service";
import { of } from "rxjs";
import { CreateEditWebhookFormComponent } from "./../common/create-edit-webhook-form/create-edit-webhook-form.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import { mockCreateWebhookSubscriptionSuccess } from "src/app/api/mock/webhooks.mock";
import { NavigationService } from "src/app/services/navigation.service";

describe("AddWebhookComponent", () => {
    let component: AddWebhookComponent;
    let fixture: ComponentFixture<AddWebhookComponent>;
    let webhooksService: WebhooksService;
    let datasetWebhooksService: DatasetWebhooksService;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [AddWebhookComponent, CreateEditWebhookFormComponent, SharedTestModule],
        });
        fixture = TestBed.createComponent(AddWebhookComponent);
        webhooksService = TestBed.inject(WebhooksService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        spyOn(webhooksService, "eventTypes").and.returnValue(of([]));
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to add webhook", () => {
        const datasetWebhookCreateSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookCreateSubscription",
        ).and.returnValue(of(mockCreateWebhookSubscriptionSuccess));

        component.addWebhook();
        expect(datasetWebhookCreateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to navigate to webhooks list", () => {
        const navigateToWebhooksSpy = spyOn(navigationService, "navigateToWebhooks");
        component.navigateToListWebhooks();
        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
    });
});
