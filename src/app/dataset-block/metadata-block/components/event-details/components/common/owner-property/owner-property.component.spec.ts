/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OwnerPropertyComponent } from "./owner-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { AccountBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { RouterModule } from "@angular/router";

describe("OwnerPropertyComponent", () => {
    let component: OwnerPropertyComponent;
    let fixture: ComponentFixture<OwnerPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, RouterModule, OwnerPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OwnerPropertyComponent);
        component = fixture.componentInstance;
        component.data = { id: "1", accountName: "kamu" } as AccountBasicsFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
