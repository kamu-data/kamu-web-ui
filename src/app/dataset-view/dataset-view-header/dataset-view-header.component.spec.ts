/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetViewHeaderComponent } from "./dataset-view-header.component";
import { mockDatasetBasicsRootFragment, mockDatasetInfo } from "src/app/search/mock.data";
import { MatIconModule } from "@angular/material/icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { DatasetVisibilityModule } from "src/app/common/components/dataset-visibility/dataset-visibility.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { SearchAdditionalButtonsModule } from "src/app/common/components/search-additional-buttons/search-additional-buttons.module";
import { Apollo } from "apollo-angular";
import { DatasetService } from "../dataset.service";
import { of } from "rxjs";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";

describe("DatasetViewHeaderComponent", () => {
    let component: DatasetViewHeaderComponent;
    let fixture: ComponentFixture<DatasetViewHeaderComponent>;
    let datasetService: DatasetService;
    let modalService: ModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetViewHeaderComponent],
            providers: [Apollo],
            imports: [
                MatIconModule,
                MatMenuModule,
                HttpClientTestingModule,
                RouterModule,
                SharedTestModule,
                DatasetVisibilityModule,
                SearchAdditionalButtonsModule,
            ],
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
