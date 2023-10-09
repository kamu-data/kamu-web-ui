import { MetadataBlockFragment } from "../../api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery, TEST_BLOCK_HASH } from "../../api/mock/dataset.mock";
import { Apollo } from "apollo-angular";
import { TestBed } from "@angular/core/testing";

import { BlockService } from "./block.service";
import { DatasetApi } from "src/app/api/dataset.api";
import { of } from "rxjs";
import { first } from "rxjs/operators";
import { mockDatasetInfo } from "src/app/search/mock.data";

describe("BlockService", () => {
    let service: BlockService;
    let datasetApi: DatasetApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        service = TestBed.inject(BlockService);
        datasetApi = TestBed.inject(DatasetApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get block from api", () => {
        spyOn(datasetApi, "getBlockByHash").and.returnValue(of(mockGetMetadataBlockQuery));
        const metadataBlockChanges$ = service.metadataBlockChanges
            .pipe(first())
            .subscribe((block: MetadataBlockFragment) => {
                const expectedBlock = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
                    .blockByHash as MetadataBlockFragment;
                expect(block).toEqual(expectedBlock);
            });

        service.requestMetadataBlock(mockDatasetInfo, TEST_BLOCK_HASH).subscribe();

        expect(metadataBlockChanges$.closed).toBeTrue();
    });
});
