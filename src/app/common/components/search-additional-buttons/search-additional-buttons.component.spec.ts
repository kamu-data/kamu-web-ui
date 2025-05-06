/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SearchAdditionalButtonsComponent } from "./search-additional-buttons.component";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { SearchAdditionalButtonsModule } from "./search-additional-buttons.module";
import { SharedTestModule } from "../../modules/shared-test.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("SearchAdditionalButtonsComponent", () => {
    let component: SearchAdditionalButtonsComponent;
    let fixture: ComponentFixture<SearchAdditionalButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SearchAdditionalButtonsModule, SharedTestModule, HttpClientTestingModule],
        })
            .overrideComponent(SearchAdditionalButtonsComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(SearchAdditionalButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should trigger onResize method when window is resized", () => {
        const spyOnResize = spyOn(component, "checkWindowSize");
        window.dispatchEvent(new Event("resize"));
        fixture.detectChanges();
        expect(spyOnResize).toHaveBeenCalledWith();
    });
});
