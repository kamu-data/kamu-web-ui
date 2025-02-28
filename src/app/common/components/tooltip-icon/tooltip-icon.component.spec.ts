/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MatIconModule } from "@angular/material/icon";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TooltipIconComponent } from "./tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("TooltipIconComponent", () => {
    let component: TooltipIconComponent;
    let fixture: ComponentFixture<TooltipIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TooltipIconComponent],
            imports: [MatIconModule, NgbTooltipModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TooltipIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
