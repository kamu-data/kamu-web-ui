/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchAdditionalButtonsNavComponent } from "@common/components/search-additional-buttons/search-additional-buttons-nav.component";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { SEARCH_ADDITIONAL_BUTTONS_DESCRIPTORS } from "src/app/dataset-view/dataset-view-header/dataset-view-header.model";

describe("SearchAdditionalButtonsNavComponent", () => {
    let component: SearchAdditionalButtonsNavComponent;
    let fixture: ComponentFixture<SearchAdditionalButtonsNavComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SearchAdditionalButtonsNavComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        })
            .overrideComponent(SearchAdditionalButtonsNavComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(SearchAdditionalButtonsNavComponent);
        component = fixture.componentInstance;
        component.searchAdditionalButtonsData = SEARCH_ADDITIONAL_BUTTONS_DESCRIPTORS;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
