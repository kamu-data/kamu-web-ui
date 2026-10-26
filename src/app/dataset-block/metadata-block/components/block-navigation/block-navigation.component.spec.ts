/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";

import {
    dispatchInputEvent,
    findAllElementsByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { BlockNavigationComponent } from "src/app/dataset-block/metadata-block/components/block-navigation/block-navigation.component";
import { mockHistoryUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MOCK_DATASET_INFO } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";

describe("BlockNavigationComponent", () => {
    let component: BlockNavigationComponent;
    let fixture: ComponentFixture<BlockNavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BlockNavigationComponent, SharedTestModule],
            providers: [provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(BlockNavigationComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetInfo", MOCK_DATASET_INFO);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check clear search filter", () => {
        const testSearchHash = "Qwedfdfdfv";
        dispatchInputEvent(fixture, "searchHash", testSearchHash);
        expect(component.searchHash).toEqual(testSearchHash);

        const clearIcon = getElementByDataTestId(fixture, "clearSearchHash");
        clearIcon.click();

        expect(component.searchHash).toBe("");
    });

    it("should check search highlights the matching part of each block hash", () => {
        const testSearchHash = "zW1";
        setComponentInput(fixture, "datasetHistory", mockHistoryUpdate);

        dispatchInputEvent(fixture, "searchHash", testSearchHash);

        const blockHashes = findAllElementsByDataTestId(fixture, "block-hash", HTMLElement);
        const matchingBlocks = mockHistoryUpdate.history.filter((block) => block.blockHash.includes(testSearchHash));
        expect(matchingBlocks.length).toBeGreaterThan(0);
        expect(blockHashes.length).toEqual(matchingBlocks.length);
        blockHashes.forEach((blockHash) => {
            expect(blockHash.querySelector("span.bg-warning")?.textContent).toEqual(testSearchHash);
        });
    });

    it("should check change page number ", () => {
        const testPage = 2;
        const onPageChangeEmitSpy = spyOn(component.onPageChangeEmit, "emit");
        component.onPageChange(testPage);

        expect(onPageChangeEmitSpy).toHaveBeenCalledWith(testPage);
    });
});
