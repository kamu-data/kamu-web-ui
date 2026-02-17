/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { HashPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/hash-property/hash-property.component";

describe("HashPropertyComponent", () => {
    let component: HashPropertyComponent;
    let fixture: ComponentFixture<HashPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [provideToastr()],
            imports: [SharedTestModule, HashPropertyComponent],
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
