/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditWebhookComponent } from "./edit-webhook.component";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { CreateEditWebhookFormComponent } from "../common/create-edit-webhook-form/create-edit-webhook-form.component";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { WebhookSubscriptionStatus } from "src/app/api/kamu.graphql.interface";
import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import { of } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";

describe("EditWebhookComponent", () => {
    let component: EditWebhookComponent;
    let fixture: ComponentFixture<EditWebhookComponent>;
    let datasetWebhooksService: DatasetWebhooksService;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [EditWebhookComponent, CreateEditWebhookFormComponent, SharedTestModule],
        });
        fixture = TestBed.createComponent(EditWebhookComponent);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.editWebhooksData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            subscription: {
                targetUrl: "https://mock.com",
                status: WebhookSubscriptionStatus.Enabled,
                eventTypes: ["DATASET.REF.UPDATED"],
                id: "112-32323-3232-323",
                label: "",
            },
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to add webhook", () => {
        spyOn(navigationService, "navigateToWebhooks");
        const datasetWebhookUpdateSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookUpdateSubscription",
        ).and.returnValue(of(true));

        component.updateWebhook();
        expect(datasetWebhookUpdateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to navigate to webhooks list", () => {
        const navigateToWebhooksSpy = spyOn(navigationService, "navigateToWebhooks");
        component.navigateToListWebhooks();
        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
    });
});
