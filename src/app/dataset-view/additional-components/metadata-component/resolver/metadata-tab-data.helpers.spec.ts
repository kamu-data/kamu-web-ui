/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Params, RedirectCommand } from "@angular/router";

import { firstValueFrom, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectRedirectTo, routeSnapshot } from "@common/helpers/base-test.helpers.spec";
import { DatasetApi } from "@api/dataset.api";
import { mockDatasetBlockPositionQuery, mockGetDatasetMetadataAsOfQuery, mockOlderBlock } from "@api/mock/dataset.mock";

import { mockMetadataRootUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import {
    atOlderCommit,
    mockLatestRootSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.mock";
import {
    CommitStepMode,
    MetadataTabData,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import {
    commitStepModeFromRoute,
    requestMetadataTabData,
    schemaTabIfMissingAtCommit,
} from "src/app/dataset-view/additional-components/metadata-component/resolver/metadata-tab-data.helpers";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("requestMetadataTabData", () => {
    const METADATA_URL = `/${mockDatasetBasicsRootFragment.owner.accountName}/${mockDatasetBasicsRootFragment.name}/${DatasetViewTypeEnum.Metadata}`;
    let datasetService: DatasetService;
    let datasetApi: DatasetApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetApi = TestBed.inject(DatasetApi);
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(mockDatasetBasicsRootFragment));
        const datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        vi.spyOn(datasetSubsService, "permissionsChanges", "get").mockReturnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        vi.spyOn(datasetSubsService, "metadataSchemaChanges", "get").mockReturnValue(of(mockMetadataRootUpdate));
    });

    function licenseRoute(queryParams: Params): ActivatedRouteSnapshot {
        return routeSnapshot({ queryParams, data: { [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.License } });
    }

    function request(route: ActivatedRouteSnapshot): Promise<MetadataTabData | RedirectCommand> {
        return firstValueFrom(TestBed.runInInjectionContext(() => requestMetadataTabData(route)));
    }

    it("should emit the latest metadata without a head", async () => {
        const asOfSpy = vi.spyOn(datasetApi, "getDatasetMetadataAsOf");

        const data = await request(licenseRoute({}));

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            snapshot: mockLatestRootSnapshot,
        });
        expect(asOfSpy).not.toHaveBeenCalled();
    });

    it("should emit the metadata as of the block in the head", async () => {
        vi.spyOn(datasetApi, "getBlockPosition").mockReturnValue(of(mockDatasetBlockPositionQuery(mockOlderBlock)));
        const asOfSpy = vi
            .spyOn(datasetApi, "getDatasetMetadataAsOf")
            .mockReturnValue(of(mockGetDatasetMetadataAsOfQuery));

        const data = await request(licenseRoute({ [ProjectLinks.URL_QUERY_PARAM_HEAD]: mockOlderBlock.blockHash }));

        expect(asOfSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
            head: mockOlderBlock.blockHash,
        });
        expect(data).not.toBeInstanceOf(RedirectCommand);
        if (!(data instanceof RedirectCommand)) {
            expect(data.snapshot.block).toEqual(mockOlderBlock);
            expect(data.snapshot.isLatest).toBe(false);
        }
    });

    it("should use the first head when the parameter repeats", async () => {
        vi.spyOn(datasetApi, "getBlockPosition").mockReturnValue(of(mockDatasetBlockPositionQuery(mockOlderBlock)));
        const asOfSpy = vi
            .spyOn(datasetApi, "getDatasetMetadataAsOf")
            .mockReturnValue(of(mockGetDatasetMetadataAsOfQuery));

        await request(licenseRoute({ [ProjectLinks.URL_QUERY_PARAM_HEAD]: [mockOlderBlock.blockHash, "zzz"] }));

        expect(asOfSpy).toHaveBeenCalledWith(expect.objectContaining({ head: mockOlderBlock.blockHash }));
    });

    it("should redirect to the latest metadata of the same section for a malformed head", async () => {
        const asOfSpy = vi.spyOn(datasetApi, "getDatasetMetadataAsOf");

        const data = await request(
            licenseRoute({
                [ProjectLinks.URL_QUERY_PARAM_HEAD]: "not a hash",
                [ProjectLinks.URL_QUERY_PARAM_STEPS]: CommitStepMode.AllBlocks,
            }),
        );

        expectRedirectTo(data, `${METADATA_URL}/${MetadataTabs.License}?steps=all`);
        expect(asOfSpy).not.toHaveBeenCalled();
    });

    it("should redirect to the latest metadata for a head the chain does not have", async () => {
        vi.spyOn(datasetApi, "getBlockPosition").mockReturnValue(of(mockDatasetBlockPositionQuery(null)));
        const asOfSpy = vi.spyOn(datasetApi, "getDatasetMetadataAsOf");

        const data = await request(licenseRoute({ [ProjectLinks.URL_QUERY_PARAM_HEAD]: mockOlderBlock.blockHash }));

        expectRedirectTo(data, `${METADATA_URL}/${MetadataTabs.License}`);
        expect(asOfSpy).not.toHaveBeenCalled();
    });

    it("should redirect to the latest metadata for a head the backend cannot read as a block hash", async () => {
        vi.spyOn(datasetApi, "getBlockPosition").mockReturnValue(
            throwError(() => new Error('Failed to parse "Multihash"')),
        );

        const data = await request(licenseRoute({ [ProjectLinks.URL_QUERY_PARAM_HEAD]: mockOlderBlock.blockHash }));

        expectRedirectTo(data, `${METADATA_URL}/${MetadataTabs.License}`);
    });

    it("should propagate a failure to load the metadata as of the head", async () => {
        vi.spyOn(datasetApi, "getBlockPosition").mockReturnValue(of(mockDatasetBlockPositionQuery(mockOlderBlock)));
        vi.spyOn(datasetApi, "getDatasetMetadataAsOf").mockReturnValue(
            throwError(() => new Error("Server unreachable")),
        );

        await expect(
            request(licenseRoute({ [ProjectLinks.URL_QUERY_PARAM_HEAD]: mockOlderBlock.blockHash })),
        ).rejects.toThrow("Server unreachable");
    });
});

describe("commitStepModeFromRoute", () => {
    it("should read the step mode, metadata changes by default", () => {
        const allBlocks = routeSnapshot({ queryParams: { [ProjectLinks.URL_QUERY_PARAM_STEPS]: "all" } });
        const unknown = routeSnapshot({ queryParams: { [ProjectLinks.URL_QUERY_PARAM_STEPS]: "every" } });

        expect(commitStepModeFromRoute(allBlocks)).toEqual(CommitStepMode.AllBlocks);
        expect(commitStepModeFromRoute(unknown)).toEqual(CommitStepMode.MetadataChanges);
        expect(commitStepModeFromRoute(routeSnapshot())).toEqual(CommitStepMode.MetadataChanges);
    });
});

describe("schemaTabIfMissingAtCommit", () => {
    const route = routeSnapshot({ queryParams: { [ProjectLinks.URL_QUERY_PARAM_STEPS]: "all" } });

    function apply(snapshot: MetadataTabData["snapshot"]): Promise<MetadataTabData | RedirectCommand> {
        const data: MetadataTabData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            snapshot,
        };
        return firstValueFrom(
            TestBed.runInInjectionContext(() =>
                of(data).pipe(schemaTabIfMissingAtCommit(route, (tabData) => !tabData.snapshot.transform)),
            ),
        );
    }

    it("should lead to the Schema section of an older commit that lacks the content", async () => {
        const data = await apply(atOlderCommit(mockLatestRootSnapshot));

        expectRedirectTo(
            data,
            `/${mockDatasetBasicsRootFragment.owner.accountName}/${mockDatasetBasicsRootFragment.name}/${DatasetViewTypeEnum.Metadata}/${MetadataTabs.Schema}?head=${mockOlderBlock.blockHash}&steps=all`,
        );
    });

    it("should leave the latest commit to the resolver's own rules", async () => {
        const data = await apply(mockLatestRootSnapshot);

        expect(data).not.toBeInstanceOf(RedirectCommand);
    });
});
