/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsWebhooksTabComponent } from "./dataset-settings-webhooks-tab.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";
import { DatasetWebhooksService } from "./service/dataset-webhooks.service";
import { of } from "rxjs";
import { MatIconModule } from "@angular/material/icon";

describe("DatasetSettingsWebhooksTabComponent", () => {
    let component: DatasetSettingsWebhooksTabComponent;
    let fixture: ComponentFixture<DatasetSettingsWebhooksTabComponent>;
    let datasetWebhooksService: DatasetWebhooksService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DatasetSettingsWebhooksTabComponent],
            providers: [Apollo],
            imports: [
                SharedTestModule,
                HttpClientTestingModule,
                MatProgressBarModule,
                MatDividerModule,
                MatTableModule,
                MatIconModule,
                ToastrModule.forRoot(),
            ],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsWebhooksTabComponent);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        component = fixture.componentInstance;
        component.webhooksViewData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        };
        spyOn(datasetWebhooksService, "datasetWebhookSubscriptions").and.returnValue(of([]));

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
