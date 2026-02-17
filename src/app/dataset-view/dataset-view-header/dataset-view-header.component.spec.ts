/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { ModalService } from "@common/components/modal/modal.service";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { DatasetViewHeaderComponent } from "src/app/dataset-view/dataset-view-header/dataset-view-header.component";
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
            providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
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
});
