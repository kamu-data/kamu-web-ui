/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RenameCollectionItemModalComponent } from "./rename-collection-item-modal.component";

describe("RenameCollectionItemModalComponent", () => {
    let component: RenameCollectionItemModalComponent;
    let fixture: ComponentFixture<RenameCollectionItemModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RenameCollectionItemModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RenameCollectionItemModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
