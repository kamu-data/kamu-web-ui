/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatMenuHarness } from "@angular/material/menu/testing";

import { SearchAdditionalButtonsNavHarness } from "@common/components/search-additional-buttons/search-additional-buttons-nav.harness";
import { SearchAdditionalButtonsComponent } from "@common/components/search-additional-buttons/search-additional-buttons.component";
import { registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { SEARCH_ADDITIONAL_BUTTONS_DESCRIPTORS } from "src/app/dataset-view/dataset-view-header/dataset-view-header.model";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";

describe("SearchAdditionalButtonsComponent", () => {
    let component: SearchAdditionalButtonsComponent;
    let fixture: ComponentFixture<SearchAdditionalButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule],
            providers: [provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(SearchAdditionalButtonsComponent);
        component = fixture.componentInstance;
        setComponentInput(
            fixture,
            "searchAdditionalButtonsData",
            structuredClone(SEARCH_ADDITIONAL_BUTTONS_DESCRIPTORS),
        );
        setComponentInput(fixture, "loadingListDownsreams", false);
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
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

    it("should pass on a menu opened from the minimized buttons", async () => {
        const menuOpenSpy = spyOn(component.searchAdditionalButtonsMenuOpen, "emit");
        component.shouldMinimizeSearchAdditionalButtons = true;
        fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();

        const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
        const moreMenu = await rootLoader.getHarness(
            MatMenuHarness.with({ selector: '[data-test-id="searchAdditionalButtons"]' }),
        );
        await moreMenu.open();
        const nav = await rootLoader.getHarness(SearchAdditionalButtonsNavHarness);
        await nav.openMenu(SearchAdditionalButtonsEnum.DeriveFrom);

        expect(menuOpenSpy).toHaveBeenCalledOnceWith(SearchAdditionalButtonsEnum.DeriveFrom);
    });
});
