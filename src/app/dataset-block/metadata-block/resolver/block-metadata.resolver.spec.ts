/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { MetadataBlockInfo } from "src/app/dataset-block/metadata-block/metadata-block.types";
import ProjectLinks from "src/app/project-links";

import { blockMetadataResolverFn } from "./block-metadata.resolver";

describe("blockMetadataResolverFn", () => {
    let routeSnapshot: ActivatedRouteSnapshot;
    let blockService: BlockService;
    let router: Router;
    const MOCK_HASH_BLOCK = "weqwKwqeqwdfsdf";

    const executeResolver: ResolveFn<MetadataBlockInfo> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => blockMetadataResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: {},
                    },
                },
            ],
        });
        blockService = TestBed.inject(BlockService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        routeSnapshot.params = {
            [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
            [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
            [ProjectLinks.URL_PARAM_BLOCK_HASH]: MOCK_HASH_BLOCK,
        };

        const requestMetadataBlockSpy = spyOn(blockService, "requestMetadataBlock").and.returnValue(of());
        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(requestMetadataBlockSpy).toHaveBeenCalledOnceWith(
            { accountName: TEST_ACCOUNT_NAME, datasetName: TEST_DATASET_NAME },
            MOCK_HASH_BLOCK,
        );
    });
});
