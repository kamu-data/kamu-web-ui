/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockHistoryUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BlockNavigationComponent } from "./block-navigation.component";
import {
    dispatchInputEvent,
    getElementByDataTestId,
    registerMatSvgIcons,
} from "src/app/common/helpers/base-test.helpers.spec";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideToastr } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { MOCK_DATASET_INFO } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("BlockNavigationComponent", () => {
    let component: BlockNavigationComponent;
    let fixture: ComponentFixture<BlockNavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [BlockNavigationComponent, SharedTestModule],
    providers: [provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(BlockNavigationComponent);
        component = fixture.componentInstance;
        component.datasetInfo = MOCK_DATASET_INFO;
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

    it("should check calls highlightHash method", () => {
        const testSearchHash = "zW1";
        const highlightHashSpy = spyOn(component, "highlightHash").and.callThrough();
        component.datasetHistory = mockHistoryUpdate;

        dispatchInputEvent(fixture, "searchHash", testSearchHash);

        expect(highlightHashSpy).toHaveBeenCalledTimes(2);
    });

    it("should check change page number ", () => {
        const testPage = 2;
        const onPageChangeEmitSpy = spyOn(component.onPageChangeEmit, "emit");
        component.onPageChange(testPage);

        expect(onPageChangeEmitSpy).toHaveBeenCalledWith(testPage);
    });
});
