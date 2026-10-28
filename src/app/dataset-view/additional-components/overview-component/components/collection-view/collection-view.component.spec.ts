/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { MatTableHarness } from "@angular/material/table/testing";

import { delay, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { Mock } from "vitest";

import { ValueNotFoundHarness } from "@common/components/value-not-found/value-not-found.harness";
import { requireValue } from "@common/helpers/app.helpers";
import {
    findElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
    stubMethod,
} from "@common/helpers/base-test.helpers.spec";
import { DatasetApi } from "@api/dataset.api";
import { DatasetAsCollectionQuery } from "@api/kamu.graphql.interface";

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
    let loadCollectionInfoSpy: Mock<DatasetAsCollectionService["loadCollectionInfo"]>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CollectionViewComponent],
            providers: [Apollo, provideToastr(), provideHttpClient()],
        }).compileComponents();

        registerMatSvgIcons();

        datasetAsCollectionService = TestBed.inject(DatasetAsCollectionService);
        loadCollectionInfoSpy = vi
            .spyOn(datasetAsCollectionService, "loadCollectionInfo")
            .mockReturnValue(
                of({ path: "/test-folder", headChanged: false, connection: mockCollectionEntryConnection }),
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

    it("should navigate to a folder on double click and leave loading it to the URL", () => {
        const row: CollectionEntryViewType = {
            displayName: "another-test-folder",
            nodeType: CollectionViewNode.Folder,
            alias: "",
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: null,
            size: null,
            owner: null,
            contentType: null,
            extraData: {},
        };
        const isHeadHashBlockChangedSpy = vi.spyOn(datasetService, "isHeadHashBlockChanged").mockReturnValue(of(true));
        const navigateToDatasetViewSpy = stubMethod(TestBed.inject(NavigationService), "navigateToDatasetView");

        component.dbClickTableRow(row);
        expect(isHeadHashBlockChangedSpy).not.toHaveBeenCalled();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
            tab: DatasetViewTypeEnum.Overview,
            [ProjectLinks.URL_QUERY_PARAM_PATH_PREFIX]: "/test-folder/another-test-folder",
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
        const navigateToDatasetViewSpy = stubMethod(TestBed.inject(NavigationService), "navigateToDatasetView");
        component.goUp();
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
                of({
                    path: pathPrefix,
                    headChanged: false,
                    connection: { ...mockCollectionEntryConnection, totalCount: 0, nodes: [] },
                }),
            );

            fixture = TestBed.createComponent(CollectionViewComponent);
            component = fixture.componentInstance;
            setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
            setComponentInput(fixture, "pathPrefix", pathPrefix);
            fixture.detectChanges();
        }

        it("should say there is no such folder", async () => {
            createWithNoEntries("/missing");

            const notFound = await TestbedHarnessEnvironment.loader(fixture).getHarness(ValueNotFoundHarness);

            expect(await notFound.getMessage()).toBe("There is no folder /missing in this collection.");
        });

        it("should lead to the collection root", async () => {
            createWithNoEntries("/missing");
            vi.spyOn(datasetService, "isHeadHashBlockChanged").mockReturnValue(of(false));
            const navigateToDatasetViewSpy = stubMethod(TestBed.inject(NavigationService), "navigateToDatasetView");
            const notFound = await TestbedHarnessEnvironment.loader(fixture).getHarness(ValueNotFoundHarness);

            await notFound.runAction();

            expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
                accountName: mockDatasetBasicsRootFragment.owner.accountName,
                datasetName: mockDatasetBasicsRootFragment.name,
                tab: DatasetViewTypeEnum.Overview,
                [ProjectLinks.URL_QUERY_PARAM_PATH_PREFIX]: "/",
            });
        });

        it("should keep the empty-collection message at the root", async () => {
            createWithNoEntries("/");

            const notFound = await TestbedHarnessEnvironment.loader(fixture).getHarnessOrNull(ValueNotFoundHarness);

            expect(notFound).toBeNull();
        });
    });

    describe("the folder in the URL", () => {
        /** Answers with the entries of the mock connection under the requested folder; only the root has a next page */
        function collectionQueryFor(pathPrefix: string): DatasetAsCollectionQuery {
            const query = structuredClone(mockDatasetAsCollectionQuery);
            const entries = requireValue(requireValue(query.datasets.byId).asCollection).latest.entries;
            entries.nodes = mockCollectionEntryConnection.nodes.filter((node) => node.path.startsWith(pathPrefix));
            entries.totalCount = entries.nodes.length;
            entries.pageInfo.hasNextPage = pathPrefix === "/";
            return query;
        }

        function createAt(pathPrefix: string): void {
            fixture.destroy();
            // The fixture beforeEach built has cached its entries under its own folder
            datasetAsCollectionService.cacheEntries.clear();
            loadCollectionInfoSpy.mockRestore();
            vi.spyOn(datasetApi, "getDatasetAsCollection").mockImplementation((params) =>
                of(collectionQueryFor(params.pathPrefix)).pipe(delay(0)),
            );
            vi.spyOn(datasetService, "isHeadHashBlockChanged").mockReturnValue(of(false).pipe(delay(0)));

            fixture = TestBed.createComponent(CollectionViewComponent);
            component = fixture.componentInstance;
            setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
            setComponentInput(fixture, "pathPrefix", pathPrefix);
            fixture.detectChanges();
        }

        /** Waits for the answers still on their way, which render after the harness has settled */
        async function listedNames(): Promise<string[]> {
            await fixture.whenStable();
            fixture.detectChanges();
            const table = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatTableHarness);
            const rows = await table.getRows();
            return Promise.all(rows.map(async (row) => (await row.getCellTextByColumnName()).name));
        }

        it("should list the entries of a folder the URL changes to", async () => {
            createAt("/");
            await fixture.whenStable();
            fixture.detectChanges();

            setComponentInput(fixture, "pathPrefix", "/test-folder");
            fixture.detectChanges();

            expect(await listedNames()).toEqual(["another-test-folder", "molecule-dataset"]);
        });

        it("should not list the previous folder's entries when they arrive after the URL changed", async () => {
            createAt("/");

            setComponentInput(fixture, "pathPrefix", "/test-folder");
            fixture.detectChanges();

            expect(await listedNames()).toEqual(["another-test-folder", "molecule-dataset"]);
        });

        it("should list the root entries again from the cache", async () => {
            createAt("/");
            const rootNames = await listedNames();
            setComponentInput(fixture, "pathPrefix", "/missing");
            fixture.detectChanges();

            setComponentInput(fixture, "pathPrefix", "/");
            fixture.detectChanges();

            expect(await listedNames()).toEqual(rootNames);
            expect(getElementByDataTestId(fixture, "collection-total-count").textContent).toContain("5");
        });

        it("should load the next page of a cached folder after a folder that had no more pages", async () => {
            createAt("/");
            await listedNames();
            setComponentInput(fixture, "pathPrefix", "/test-folder");
            fixture.detectChanges();
            await listedNames();
            setComponentInput(fixture, "pathPrefix", "/");
            fixture.detectChanges();
            await listedNames();
            const loadCollectionDataChangeSpy = vi.spyOn(datasetAsCollectionService, "loadCollectionDataChange");

            component.onScroll();

            expect(loadCollectionDataChangeSpy).toHaveBeenCalledWith({ path: "/", page: 2, scrollActivated: true });
        });

        it("should show the total count of a folder opened by a page load", async () => {
            createAt("/test-folder");
            await fixture.whenStable();
            fixture.detectChanges();

            expect(getElementByDataTestId(fixture, "collection-total-count").textContent).toContain("2");
        });
    });
});
