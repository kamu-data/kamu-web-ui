/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SettingsTabComponent } from "./settings-tab.component";
import { AccountSettingsModule } from "../../settings/account-settings.module";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";

describe("SettingsTabComponent", () => {
    let component: SettingsTabComponent;
    let fixture: ComponentFixture<SettingsTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [AccountSettingsModule, SharedTestModule, HttpClientTestingModule, ToastrModule.forRoot(), SettingsTabComponent],
    providers: [Apollo],
});
        fixture = TestBed.createComponent(SettingsTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
