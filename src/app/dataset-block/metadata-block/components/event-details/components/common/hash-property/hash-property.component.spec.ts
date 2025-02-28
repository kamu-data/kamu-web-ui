/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HashPropertyComponent } from "./hash-property.component";
import { DisplayHashModule } from "src/app/common/components/display-hash/display-hash.module";
import { ToastrModule } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("HashPropertyComponent", () => {
    let component: HashPropertyComponent;
    let fixture: ComponentFixture<HashPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HashPropertyComponent],
            imports: [DisplayHashModule, ToastrModule.forRoot(), SharedTestModule],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(HashPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
