/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockCreateWebhookSubscriptionSuccess } from "@api/mock/webhooks.mock";

import { AddWebhookComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/add-webhook/add-webhook.component";
import { WebhookFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/common/webhook-form/webhook-form.component";
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

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [AddWebhookComponent, WebhookFormComponent, SharedTestModule],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(AddWebhookComponent);
        webhooksService = TestBed.inject(WebhooksService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        vi.spyOn(webhooksService, "eventTypes").mockReturnValue(of([]));
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check to add webhook", () => {
        const datasetWebhookCreateSubscriptionSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookCreateSubscription")
            .mockReturnValue(of(mockCreateWebhookSubscriptionSuccess));

        component.addWebhook();
        expect(datasetWebhookCreateSubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to navigate to webhooks list", () => {
        const navigateToWebhooksSpy = vi.spyOn(navigationService, "navigateToWebhooks").mockImplementation(() => {});
        component.navigateToListWebhooks();
        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
    });
});
