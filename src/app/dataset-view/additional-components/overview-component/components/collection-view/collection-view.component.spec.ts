/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { delay, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { ValueNotFoundHarness } from "@common/components/value-not-found/value-not-found.harness";
import {
    findElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
    stubMethod,
} from "@common/helpers/base-test.helpers.spec";
import { DatasetApi } from "@api/dataset.api";

import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";
import {
    mockCollectionEntryConnection,
    mockDatasetAsCollectionQuery,
    mockDatasetBasicsRootFragment,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

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
            providers: [Apollo, provideToastr(), provideHttpClient()],
        }).compileComponents();

        registerMatSvgIcons();

        datasetAsCollectionService = TestBed.inject(DatasetAsCollectionService);
        vi.spyOn(datasetAsCollectionService, "loadCollectionInfo").mockReturnValue(
            of({ headChanged: false, connection: mockCollectionEntryConnection }),
        );
        datasetApi = TestBed.inject(DatasetApi);
        datasetService = TestBed.inject(DatasetService);
        fixture = TestBed.createComponent(CollectionViewComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
        setComponentInput(fixture, "pathPrefix", "/test-folder");

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check a collection loader", fakeAsync(() => {
        vi.spyOn(datasetApi, "getDatasetAsCollection").mockReturnValue(
            of(mockDatasetAsCollectionQuery).pipe(delay(10)),
        );

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
        const isHeadHashBlockChangedSpy = vi
            .spyOn(datasetService, "isHeadHashBlockChanged")
            .mockReturnValue(of(true).pipe());

        const navigateToDatasetViewSpy = vi
            .spyOn(TestBed.inject(NavigationService), "navigateToDatasetView")
            .mockImplementation(() => {});

        component.dbClickTableRow(row);
        expect(isHeadHashBlockChangedSpy).toHaveBeenCalledTimes(1);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
            tab: DatasetViewTypeEnum.Overview,
            [ProjectLinks.URL_QUERY_PARAM_PATH_PREFIX]: component.pathPrefix,
        });
    });

    it("should check double click on file row", () => {
        const row: CollectionEntryViewType = {
            displayName: "test-file",
            nodeType: CollectionViewNode.File,
            alias: "account/test-file",
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: "ewqeqwdsd1sl5l3lfdsfdsf",
            size: 255548,
            owner: { __typename: "Account", accountName: "twest" },
            contentType: "application/pdf",
            extraData: {},
        };
        const isHeadHashBlockChangedSpy = vi
            .spyOn(datasetService, "isHeadHashBlockChanged")
            .mockReturnValue(of(true).pipe());
        const windowOpenSpy = stubMethod(window, "open");

        component.dbClickTableRow(row);
        expect(isHeadHashBlockChangedSpy).toHaveBeenCalledTimes(0);
        expect(windowOpenSpy).toHaveBeenCalledTimes(1);
        expect(windowOpenSpy).toHaveBeenCalledWith("/account/test-file", "_blank");
    });

    it("should check to select table row", () => {
        const row: CollectionEntryViewType = {
            displayName: "test-file",
            nodeType: CollectionViewNode.File,
            alias: "account/test-file",
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: "ewqeqwdsd1sl5l3lfdsfdsf",
            size: 255548,
            owner: { __typename: "Account", accountName: "twest" },
            contentType: "application/pdf",
            extraData: {},
        };
        expect(component.selectedRow).toEqual(null);

        component.clickTableRow(row);
        component.onCellEventClick("test", CollectionViewNode.File);
        expect(component.selectedRow).toEqual(row);
    });

    it("should check go up from folder", () => {
        const isHeadHashBlockChangedSpy = vi
            .spyOn(datasetService, "isHeadHashBlockChanged")
            .mockReturnValue(of(true).pipe());
        const navigateToDatasetViewSpy = vi
            .spyOn(TestBed.inject(NavigationService), "navigateToDatasetView")
            .mockImplementation(() => {});
        component.currentPage = 2;
        component.goUp();
        expect(component.currentPage).toEqual(1);
        expect(isHeadHashBlockChangedSpy).toHaveBeenCalledTimes(1);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
            tab: DatasetViewTypeEnum.Overview,
            [ProjectLinks.URL_QUERY_PARAM_PATH_PREFIX]: "/",
        });
    });

    describe("a folder the collection does not have", () => {
        function createWithNoEntries(pathPrefix: string): void {
            fixture.destroy();
            vi.spyOn(datasetAsCollectionService, "loadCollectionInfo").mockReturnValue(
                of({ headChanged: false, connection: { ...mockCollectionEntryConnection, totalCount: 0, nodes: [] } }),
            );
            fixture = TestBed.createComponent(CollectionViewComponent);
            component = fixture.componentInstance;
            setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
            setComponentInput(fixture, "pathPrefix", pathPrefix);
            fixture.detectChanges();
        }

        it("says there is no such folder and leads to the root", async () => {
            createWithNoEntries("/missing");
            const openFolderSpy = stubMethod(component, "openFolder");
            const notFound = await TestbedHarnessEnvironment.loader(fixture).getHarness(ValueNotFoundHarness);

            expect(await notFound.getMessage()).toBe("There is no folder /missing in this collection.");
            await notFound.runAction();
            expect(openFolderSpy).toHaveBeenCalledWith("/");
        });

        it("keeps the empty-collection message at the root", async () => {
            createWithNoEntries("/");

            const notFound = await TestbedHarnessEnvironment.loader(fixture).getHarnessOrNull(ValueNotFoundHarness);

            expect(notFound).toBeNull();
        });
    });
});
