/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";

import { requireValue } from "@common/helpers/app.helpers";
import { expectPageNotFoundRedirect, routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import { mockGetMetadataBlockQuery, TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { MetadataBlockInfo } from "src/app/dataset-block/metadata-block/metadata-block.types";
import { blockMetadataResolverFn } from "src/app/dataset-block/metadata-block/resolver/block-metadata.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";

describe("blockMetadataResolverFn", () => {
    let blockService: BlockService;
    let datasetService: DatasetService;
    const MOCK_HASH_BLOCK = "weqwKwqeqwdfsdf";

    const route = routeSnapshot({
        params: {
            [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
            [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
            [ProjectLinks.URL_PARAM_BLOCK_HASH]: MOCK_HASH_BLOCK,
        },
    });

    const mockDatasetMetadata = requireValue(mockGetMetadataBlockQuery.datasets.byOwnerAndName ?? null).metadata;
    const mockBlockInfo: MetadataBlockInfo = {
        block: requireValue(mockDatasetMetadata.chain.blockByHash ?? null),
        blockAsYaml: requireValue(mockDatasetMetadata.chain.blockByHashEncoded ?? null),
        downstreamsCount: mockDatasetMetadata.currentDownstreamDependenciesCount,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        blockService = TestBed.inject(BlockService);
        datasetService = TestBed.inject(DatasetService);
    });

    it("should request the block from the route and publish its downstreams count", async () => {
        const requestMetadataBlockSpy = spyOn(blockService, "requestMetadataBlock").and.returnValue(of(mockBlockInfo));
        const emitDownstreamsCountChangedSpy = spyOn(datasetService, "emitDownstreamsCountChanged");

        const data = await runResolver(blockMetadataResolverFn, route);

        expect(requestMetadataBlockSpy).toHaveBeenCalledOnceWith(
            { accountName: TEST_ACCOUNT_NAME, datasetName: TEST_DATASET_NAME },
            MOCK_HASH_BLOCK,
        );
        expect(emitDownstreamsCountChangedSpy).toHaveBeenCalledOnceWith(mockBlockInfo.downstreamsCount);
        expect(data).toEqual(mockBlockInfo);
    });

    it("should redirect to page not found when the dataset or the block does not exist", async () => {
        spyOn(blockService, "requestMetadataBlock").and.returnValue(of(undefined));
        const emitDownstreamsCountChangedSpy = spyOn(datasetService, "emitDownstreamsCountChanged");

        const data = await runResolver(blockMetadataResolverFn, route);

        expectPageNotFoundRedirect(data);
        expect(emitDownstreamsCountChangedSpy).not.toHaveBeenCalled();
    });

    it("should redirect to page not found when the block cannot be loaded", async () => {
        spyOn(blockService, "requestMetadataBlock").and.returnValue(throwError(() => new Error("fail")));
        const emitDownstreamsCountChangedSpy = spyOn(datasetService, "emitDownstreamsCountChanged");

        const data = await runResolver(blockMetadataResolverFn, route);

        expectPageNotFoundRedirect(data);
        expect(emitDownstreamsCountChangedSpy).not.toHaveBeenCalled();
    });
});
