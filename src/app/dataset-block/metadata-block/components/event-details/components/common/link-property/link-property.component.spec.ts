/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "src/app/common/modules/shared-test.module";

import { LinkPropertyComponent } from "./link-property.component";

describe("LinkPropertyComponent", () => {
    let component: LinkPropertyComponent;
    let fixture: ComponentFixture<LinkPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, LinkPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LinkPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
