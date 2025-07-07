/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SettingsTabComponent } from "./settings-tab.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

describe("SettingsTabComponent", () => {
    let component: SettingsTabComponent;
    let fixture: ComponentFixture<SettingsTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedTestModule, SettingsTabComponent],
            providers: [Apollo, provideToastr()],
        });
        fixture = TestBed.createComponent(SettingsTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
