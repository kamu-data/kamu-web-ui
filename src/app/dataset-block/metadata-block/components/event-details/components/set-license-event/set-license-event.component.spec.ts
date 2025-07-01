/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSetLicense } from "../../mock.events";
import { SetLicenseEventComponent } from "./set-license-event.component";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LinkPropertyComponent } from "../common/link-property/link-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("SetLicenseEventComponent", () => {
    let component: SetLicenseEventComponent;
    let fixture: ComponentFixture<SetLicenseEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatIconModule,
                NgbTooltipModule,
                SharedTestModule,
                SetLicenseEventComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
                LinkPropertyComponent,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SetLicenseEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetLicense;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
