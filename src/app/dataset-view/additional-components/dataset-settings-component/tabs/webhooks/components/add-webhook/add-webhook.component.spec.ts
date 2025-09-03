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

describe("AddWebhookComponent", () => {
    let component: AddWebhookComponent;
    let fixture: ComponentFixture<AddWebhookComponent>;
    let webhooksService: WebhooksService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [AddWebhookComponent, CreateEditWebhookFormComponent, SharedTestModule],
        });
        fixture = TestBed.createComponent(AddWebhookComponent);
        webhooksService = TestBed.inject(WebhooksService);
        component = fixture.componentInstance;
        spyOn(webhooksService, "eventTypes").and.returnValue(of([]));
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
