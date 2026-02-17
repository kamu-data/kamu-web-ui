/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import { RotateSecretWebhookComponent } from "./rotate-secret-webhook.component";

describe("RotateSecretWebhookComponent", () => {
    let component: RotateSecretWebhookComponent;
    let fixture: ComponentFixture<RotateSecretWebhookComponent>;
    let datasetWebhooksService: DatasetWebhooksService;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RotateSecretWebhookComponent, SharedTestModule],
            providers: [
                Apollo,
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        registerMatSvgIcons();
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        navigationService = TestBed.inject(NavigationService);

        fixture = TestBed.createComponent(RotateSecretWebhookComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.webhookId = "55-23456-888-890";
        spyOn(datasetWebhooksService, "datasetWebhookRotateSecret").and.returnValue(of("mock-secret"));

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check secret", () => {
        expect(component.secret).toEqual("mock-secret");
    });

    it("should check navigate to webhooks list", () => {
        const navigateToWebhooksSpy = spyOn(navigationService, "navigateToWebhooks");
        component.navigateToListWebhooks();
        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
    });
});
