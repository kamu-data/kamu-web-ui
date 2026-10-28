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
import { Mock } from "vitest";

import { requireValue } from "@common/helpers/app.helpers";
import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockDatasetWebhookByIdQuery } from "@api/mock/webhooks.mock";

import { RotateSecretWebhookComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/rotate-secret-webhook/rotate-secret-webhook.component";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("RotateSecretWebhookComponent", () => {
    let component: RotateSecretWebhookComponent;
    let fixture: ComponentFixture<RotateSecretWebhookComponent>;
    let datasetWebhooksService: DatasetWebhooksService;
    let navigationService: NavigationService;
    let rotateSecretSpy: Mock<DatasetWebhooksService["datasetWebhookRotateSecret"]>;

    const mockWebhookSubscription = requireValue(mockDatasetWebhookByIdQuery.datasets.byId?.webhooks.subscription);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RotateSecretWebhookComponent, SharedTestModule],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });
        registerMatSvgIcons();
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        navigationService = TestBed.inject(NavigationService);

        fixture = TestBed.createComponent(RotateSecretWebhookComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "webhookData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            subscription: mockWebhookSubscription,
        });

        rotateSecretSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookRotateSecret")
            .mockReturnValue(of("mock-secret"));

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should rotate the secret of the resolved subscription", () => {
        expect(rotateSecretSpy).toHaveBeenCalledWith(mockDatasetBasicsRootFragment.id, mockWebhookSubscription.id);
        expect(component.secret).toEqual("mock-secret");
    });

    it("should check navigate to webhooks list", () => {
        const navigateToWebhooksSpy = stubMethod(navigationService, "navigateToWebhooks");

        component.navigateToListWebhooks();

        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
    });
});
