/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsWebhooksTabComponent } from "./dataset-settings-webhooks-tab.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

describe("DatasetSettingsWebhooksTabComponent", () => {
    let component: DatasetSettingsWebhooksTabComponent;
    let fixture: ComponentFixture<DatasetSettingsWebhooksTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [SharedTestModule],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsWebhooksTabComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
