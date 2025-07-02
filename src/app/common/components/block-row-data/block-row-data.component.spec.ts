/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TooltipIconComponent } from "../tooltip-icon/tooltip-icon.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BlockRowDataComponent } from "./block-row-data.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("BlockRowDataComponent", () => {
    let component: BlockRowDataComponent;
    let fixture: ComponentFixture<BlockRowDataComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatIconModule, NgbTooltipModule, BlockRowDataComponent, TooltipIconComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BlockRowDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
