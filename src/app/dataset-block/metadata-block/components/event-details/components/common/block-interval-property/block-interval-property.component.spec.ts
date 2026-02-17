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

import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { DatasetService } from "../../../../../../../dataset-view/dataset.service";
import { mockDatasetMainDataResponse } from "../../../../../../../search/mock.data";
import { BlockIntervalPropertyComponent } from "./block-interval-property.component";

describe("BlockIntervalPropertyComponent", () => {
    let component: BlockIntervalPropertyComponent;
    let fixture: ComponentFixture<BlockIntervalPropertyComponent>;
    let datasetService: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SharedTestModule, BlockIntervalPropertyComponent],
            providers: [provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(BlockIntervalPropertyComponent);
        datasetService = TestBed.inject(DatasetService);
        component = fixture.componentInstance;
        component.data = {
            prevBlockHash: "f1620a798caf694d544a7ad590fa2230e4c518de1acce010789d0056c61a1fa69d95a",
            newBlockHash: "f162050f7d722779b38215a3770b905842b7214599d80aff1d9479288b5a056a005e2",
            datasetId: "did:odf:fed015c38ec1ae4b02f6f02d78c8ff2752bed730833efb6e9bf431259acdc08f5e27c",
        };

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check call requestDatasetInfoById from datasetService in ngOnInit", () => {
        const requestDatasetInfoByIdSpy = spyOn(datasetService, "requestDatasetInfoById").and.returnValue(
            of({
                __typename: "Query",
                datasets: {
                    __typename: "Datasets",
                    byId: mockDatasetMainDataResponse.datasets.byOwnerAndName,
                },
            }),
        );
        component.ngOnInit();
        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledTimes(1);
    });
});
