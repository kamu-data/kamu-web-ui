/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BlockHeaderComponent } from "./block-header.component";
import { Apollo } from "apollo-angular";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("BlockHeaderComponent", () => {
    let component: BlockHeaderComponent;
    let fixture: ComponentFixture<BlockHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, BlockHeaderComponent],
            providers: [Apollo],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(BlockHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
