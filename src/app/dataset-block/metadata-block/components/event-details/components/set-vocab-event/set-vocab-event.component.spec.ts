/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockSetVocab } from "../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetVocabEventComponent } from "./set-vocab-event.component";
import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("SetVocabEventComponent", () => {
    let component: SetVocabEventComponent;
    let fixture: ComponentFixture<SetVocabEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [MatIconModule, NgbTooltipModule, SharedTestModule, SetVocabEventComponent, CardsPropertyComponent, BlockRowDataComponent, TooltipIconComponent],
}).compileComponents();

        fixture = TestBed.createComponent(SetVocabEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetVocab;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
