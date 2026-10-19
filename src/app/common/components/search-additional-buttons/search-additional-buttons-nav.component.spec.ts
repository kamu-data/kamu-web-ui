/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchAdditionalButtonsNavComponent } from "@common/components/search-additional-buttons/search-additional-buttons-nav.component";
import { SearchAdditionalButtonsNavHarness } from "@common/components/search-additional-buttons/search-additional-buttons-nav.harness";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { MaybeUndefined } from "@interface/app.types";

import { SEARCH_ADDITIONAL_BUTTONS_DESCRIPTORS } from "src/app/dataset-view/dataset-view-header/dataset-view-header.model";
import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";

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
        component.loadingListDownsreams = false;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("Derive from menu footnote", () => {
        let harness: SearchAdditionalButtonsNavHarness;

        function setDeriveFromFootnote(footnote: MaybeUndefined<string>): void {
            component.searchAdditionalButtonsData = SEARCH_ADDITIONAL_BUTTONS_DESCRIPTORS.map((item) =>
                item.value === SearchAdditionalButtonsEnum.DeriveFrom
                    ? { ...item, additionalOptions: { ...item.additionalOptions, footnote } }
                    : item,
            );
        }

        beforeEach(async () => {
            harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchAdditionalButtonsNavHarness);
        });

        it("should show the footnote in the opened menu", async () => {
            setDeriveFromFootnote("+2 private datasets you cannot view");
            await harness.openMenu(SearchAdditionalButtonsEnum.DeriveFrom);

            expect(await harness.getMenuFootnote()).toEqual("+2 private datasets you cannot view");
        });

        it("should not show a footnote when there is none", async () => {
            setDeriveFromFootnote(undefined);
            await harness.openMenu(SearchAdditionalButtonsEnum.DeriveFrom);

            expect(await harness.getMenuFootnote()).toBeNull();
        });
    });
});
