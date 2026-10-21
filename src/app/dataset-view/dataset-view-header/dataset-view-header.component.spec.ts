/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { ModalService } from "@common/components/modal/modal.service";
import { SearchAdditionalButtonsNavHarness } from "@common/components/search-additional-buttons/search-additional-buttons-nav.harness";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { DatasetViewHeaderComponent } from "src/app/dataset-view/dataset-view-header/dataset-view-header.component";
import { hiddenDownstreamsFootnote } from "src/app/dataset-view/dataset-view-header/dataset-view-header.model";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetBasicsRootFragment, mockDatasetInfo } from "src/app/search/mock.data";
import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";

describe("DatasetViewHeaderComponent", () => {
    let component: DatasetViewHeaderComponent;
    let fixture: ComponentFixture<DatasetViewHeaderComponent>;
    let datasetService: DatasetService;
    let modalService: ModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, DatasetViewHeaderComponent],
            providers: [Apollo, provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetViewHeaderComponent);
        modalService = TestBed.inject(ModalService);
        datasetService = TestBed.inject(DatasetService);
        spyOnProperty(datasetService, "downstreamsCountChanges", "get").and.returnValue(of(1));
        component = fixture.componentInstance;
        component.datasetInfo = mockDatasetInfo;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    [
        { method: SearchAdditionalButtonsEnum.Starred, calledTimes: 1 },
        { method: SearchAdditionalButtonsEnum.UnWatch, calledTimes: 1 },
        { method: SearchAdditionalButtonsEnum.DeriveFrom, calledTimes: 0 },
    ].forEach((item: { method: SearchAdditionalButtonsEnum; calledTimes: number }) => {
        it(`should check onClickSearchAdditionalButton for method=${item.method}`, () => {
            const modalWarningSpy = spyOn(modalService, "warning").and.callFake((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
            component.onClickSearchAdditionalButton(item.method);
            expect(modalWarningSpy).toHaveBeenCalledTimes(item.calledTimes);
        });
    });

    [
        SearchAdditionalButtonsEnum.Starred,
        SearchAdditionalButtonsEnum.UnWatch,
        SearchAdditionalButtonsEnum.DeriveFrom,
    ].forEach((item: SearchAdditionalButtonsEnum) => {
        it(`should check onClickSearchAdditionalButtonsMenuOpen for method=${item}`, () => {
            const requestListDownstreamsSpy = spyOn(datasetService, "requestListDownstreams").and.returnValue(
                of(["accountName/datasetName"]),
            );
            component.onClickSearchAdditionalButtonsMenuOpen(item);
            if (item === SearchAdditionalButtonsEnum.DeriveFrom) {
                expect(requestListDownstreamsSpy).toHaveBeenCalledTimes(1);
            } else {
                expect(requestListDownstreamsSpy).toHaveBeenCalledTimes(0);
            }
        });
    });

    describe("Derive from menu footnote", () => {
        let nav: SearchAdditionalButtonsNavHarness;

        beforeEach(async () => {
            nav = await TestbedHarnessEnvironment.loader(fixture).getHarness(SearchAdditionalButtonsNavHarness);
        });

        it("should show a footnote when the counter is higher than the accessible downstreams", async () => {
            spyOn(datasetService, "requestListDownstreams").and.returnValue(of([]));
            await nav.openMenu(SearchAdditionalButtonsEnum.DeriveFrom);

            expect(await nav.getMenuFootnote()).toEqual("+1 private dataset you cannot view");
        });

        it("should count several hidden downstreams in the plural", () => {
            expect(hiddenDownstreamsFootnote(2)).toEqual("+2 private datasets you cannot view");
        });

        it("should not show a footnote when all downstreams are accessible", async () => {
            spyOn(datasetService, "requestListDownstreams").and.returnValue(of(["accountName/datasetName"]));
            await nav.openMenu(SearchAdditionalButtonsEnum.DeriveFrom);

            expect(await nav.getMenuFootnote()).toBeNull();
        });

        it("should drop the footnote when reopened after all downstreams became accessible", async () => {
            const requestListDownstreamsSpy = spyOn(datasetService, "requestListDownstreams").and.returnValue(of([]));
            await nav.openMenu(SearchAdditionalButtonsEnum.DeriveFrom);
            await nav.closeMenu(SearchAdditionalButtonsEnum.DeriveFrom);

            requestListDownstreamsSpy.and.returnValue(of(["accountName/datasetName"]));
            await nav.openMenu(SearchAdditionalButtonsEnum.DeriveFrom);

            expect(await nav.getMenuFootnote()).toBeNull();
        });
    });
});
