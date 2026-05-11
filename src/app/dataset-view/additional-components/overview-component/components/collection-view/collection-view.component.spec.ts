/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { SimpleChanges } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { delay, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { findElementByDataTestId, registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { DatasetApi } from "@api/dataset.api";

import {
    mockCollectionEntryConnection,
    mockDatasetAsCollectionQuery,
    mockDatasetBasicsRootFragment,
} from "src/app/search/mock.data";

import { DatasetAsCollectionService } from "../../services/dataset-as-collection.service";
import { DatasetService } from "./../../../../dataset.service";
import { CollectionViewComponent } from "./collection-view.component";
import { CollectionEntryViewType, CollectionViewNode } from "./collection-view.model";

describe("CollectionViewComponent", () => {
    let component: CollectionViewComponent;
    let fixture: ComponentFixture<CollectionViewComponent>;
    let datasetAsCollectionService: DatasetAsCollectionService;
    let datasetApi: DatasetApi;
    let datasetService: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CollectionViewComponent],
            providers: [Apollo, provideToastr(), provideHttpClient(withInterceptorsFromDi())],
        }).compileComponents();

        registerMatSvgIcons();

        datasetAsCollectionService = TestBed.inject(DatasetAsCollectionService);
        spyOn(datasetAsCollectionService, "loadCollectionInfo").and.returnValue(
            of({ headChanged: false, connection: mockCollectionEntryConnection }),
        );
        datasetApi = TestBed.inject(DatasetApi);
        datasetService = TestBed.inject(DatasetService);
        fixture = TestBed.createComponent(CollectionViewComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        const datasetBasicsSimpleChanges: SimpleChanges = {
            datasetBasics: {
                previousValue: undefined,
                currentValue: mockDatasetBasicsRootFragment,
                firstChange: true,
                isFirstChange: () => true,
            },
        };
        component.ngOnChanges(datasetBasicsSimpleChanges);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check a collection loader", fakeAsync(() => {
        spyOn(datasetApi, "getDatasetAsCollection").and.returnValue(of(mockDatasetAsCollectionQuery).pipe(delay(10)));

        tick(5);
        fixture.detectChanges();
        const collectionLoader = findElementByDataTestId(fixture, "collection-loader");
        expect(collectionLoader).toBeDefined();

        flush();
    }));

    it("should check scroll with all data loaded", () => {
        component.isAllDataLoaded = true;
        component.onScroll();
        expect(component.currentPage).toEqual(1);
    });

    it("should check scroll with all data not loaded", () => {
        component.isAllDataLoaded = false;
        component.onScroll();
        expect(component.currentPage).toEqual(2);
    });

    it("should check double click on folder row ", () => {
        const row: CollectionEntryViewType = {
            displayName: "test-folder",
            nodeType: CollectionViewNode.Folder,
            alias: "",
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: null,
            size: null,
            owner: null,
            contentType: null,
            extraData: {},
        };
        datasetAsCollectionService.cacheEntries.set(component.pathPrefix, [row]);
        const isHeadHashBlockChangedSpy = spyOn(datasetService, "isHeadHashBlockChanged").and.returnValue(
            of(true).pipe(),
        );

        component.dbClickTableRow(row);
        expect(isHeadHashBlockChangedSpy).toHaveBeenCalledTimes(1);
        expect(component.maxDepth).toEqual(1);
    });

    it("should check double click on file row", () => {
        const row: CollectionEntryViewType = {
            displayName: "test-file",
            nodeType: CollectionViewNode.File,
            alias: "account/test-file",
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: "ewqeqwdsd1sl5l3lfdsfdsf",
            size: 255548,
            owner: {
                accountName: "twest",
            },
            contentType: "application/pdf",
            extraData: {},
        };
        const isHeadHashBlockChangedSpy = spyOn(datasetService, "isHeadHashBlockChanged").and.returnValue(
            of(true).pipe(),
        );

        component.dbClickTableRow(row);
        expect(isHeadHashBlockChangedSpy).toHaveBeenCalledTimes(0);
        expect(component.maxDepth).toEqual(0);
    });

    it("should check to select table row", () => {
        const row: CollectionEntryViewType = {
            displayName: "test-file",
            nodeType: CollectionViewNode.File,
            alias: "account/test-file",
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: "ewqeqwdsd1sl5l3lfdsfdsf",
            size: 255548,
            owner: {
                accountName: "twest",
            },
            contentType: "application/pdf",
            extraData: {},
        };
        expect(component.selectedRow).toEqual(null);

        component.clickTableRow(row);
        component.onCellEventClick("test", CollectionViewNode.File);
        expect(component.selectedRow).toEqual(row);
    });

    it("should check double click on file row", () => {
        const row: CollectionEntryViewType = {
            displayName: "test-file",
            nodeType: CollectionViewNode.File,
            alias: "account/test-file",
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: "ewqeqwdsd1sl5l3lfdsfdsf",
            size: 255548,
            owner: {
                accountName: "twest",
            },
            contentType: "application/pdf",
            extraData: {},
        };
        const isHeadHashBlockChangedSpy = spyOn(datasetService, "isHeadHashBlockChanged").and.returnValue(
            of(true).pipe(),
        );

        component.dbClickTableRow(row);
        expect(isHeadHashBlockChangedSpy).toHaveBeenCalledTimes(0);
        expect(component.maxDepth).toEqual(0);
    });

    it("should check go up from folder", () => {
        const row: CollectionEntryViewType = {
            displayName: "test-file",
            nodeType: CollectionViewNode.File,
            alias: "account/test-file",
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: "ewqeqwdsd1sl5l3lfdsfdsf",
            size: 255548,
            owner: {
                accountName: "twest",
            },
            contentType: "application/pdf",
            extraData: {},
        };
        const isHeadHashBlockChangedSpy = spyOn(datasetService, "isHeadHashBlockChanged").and.returnValue(
            of(true).pipe(),
        );
        component.maxDepth = 1;
        component.goUp();
        expect(component.maxDepth).toEqual(0);
        expect(isHeadHashBlockChangedSpy).toHaveBeenCalledTimes(1);
    });
});
