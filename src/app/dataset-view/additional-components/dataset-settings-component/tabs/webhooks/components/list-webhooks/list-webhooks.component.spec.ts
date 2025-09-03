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

describe("ListWebhooksComponent", () => {
    let component: ListWebhooksComponent;
    let fixture: ComponentFixture<ListWebhooksComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [ListWebhooksComponent, SharedTestModule, HttpClientTestingModule],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(ListWebhooksComponent);
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
});
