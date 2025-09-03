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

describe("EditWebhookComponent", () => {
    let component: EditWebhookComponent;
    let fixture: ComponentFixture<EditWebhookComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [EditWebhookComponent, CreateEditWebhookFormComponent, SharedTestModule],
        });
        fixture = TestBed.createComponent(EditWebhookComponent);
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
});
