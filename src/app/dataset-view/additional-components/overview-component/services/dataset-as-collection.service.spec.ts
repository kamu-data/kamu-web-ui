/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { DatasetApi } from "@api/dataset.api";
import { TEST_DATASET_ID } from "@api/mock/dataset.mock";

import { mockDatasetAsCollectionQuery } from "src/app/search/mock.data";

import { CollectionEntriesResult } from "../components/collection-view/collection-view.model";
import { DatasetAsCollectionService } from "./dataset-as-collection.service";

describe("DatasetAsCollectionService", () => {
    let service: DatasetAsCollectionService;
    let datasetApi: DatasetApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Apollo,
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(DatasetAsCollectionService);
        datasetApi = TestBed.inject(DatasetApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check loading changes", () => {
        service.loadingCollectionChanges.subscribe((loading) => {
            expect(loading).toEqual(true);
        });
        service.loadingOnScrollChanges.subscribe((loading) => {
            expect(loading).toEqual(false);
        });
    });

    it("should check #loadCollectionInfo method", () => {
        const PER_PAGE = 20;
        const PAGE = 0;
        const getDatasetAsCollectionSpy = spyOn(datasetApi, "getDatasetAsCollection").and.returnValue(
            of(mockDatasetAsCollectionQuery),
        );
        service.loadCollectionDataChange({ path: "/", page: PAGE, headChanged: true });

        service.loadCollectionInfo(TEST_DATASET_ID, PER_PAGE).subscribe((data: CollectionEntriesResult) => {
            expect(getDatasetAsCollectionSpy).toHaveBeenCalledTimes(1);
            expect(data.headChanged).toEqual(true);
        });
    });

    it("should check #loadCollectionInfo method with scroll", () => {
        const PER_PAGE = 20;
        const PAGE = 0;
        const getDatasetAsCollectionSpy = spyOn(datasetApi, "getDatasetAsCollection").and.returnValue(
            of(mockDatasetAsCollectionQuery),
        );
        service.loadCollectionDataChange({ path: "/", page: PAGE, scrollActivated: true, headChanged: false });

        service.loadCollectionInfo(TEST_DATASET_ID, PER_PAGE).subscribe((data: CollectionEntriesResult) => {
            expect(getDatasetAsCollectionSpy).toHaveBeenCalledTimes(1);
            expect(data.headChanged).toEqual(false);
        });
    });
});
