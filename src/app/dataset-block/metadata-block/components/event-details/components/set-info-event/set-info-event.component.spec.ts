/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";
import { mockSetInfo } from "../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetInfoEventComponent } from "./set-info-event.component";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("SetInfoEventComponent", () => {
    let component: SetInfoEventComponent;
    let fixture: ComponentFixture<SetInfoEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatIconModule,
                NgbTooltipModule,
                SharedTestModule,
                SetInfoEventComponent,
                CardsPropertyComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SetInfoEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
