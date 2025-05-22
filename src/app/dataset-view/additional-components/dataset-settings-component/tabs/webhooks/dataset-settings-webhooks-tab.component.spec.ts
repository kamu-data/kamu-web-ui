/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsWebhooksTabComponent } from "./dataset-settings-webhooks-tab.component";

describe("DatasetSettingsWebhooksTabComponent", () => {
    let component: DatasetSettingsWebhooksTabComponent;
    let fixture: ComponentFixture<DatasetSettingsWebhooksTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DatasetSettingsWebhooksTabComponent],
        });
        fixture = TestBed.createComponent(DatasetSettingsWebhooksTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
