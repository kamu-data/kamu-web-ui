/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { DatasetApi } from "@api/dataset.api";
import { DatasetBlocksSchemaByEventTypeQuery, MetadataEventType } from "@api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery, TEST_BLOCK_HASH } from "@api/mock/dataset.mock";
import { MaybeUndefined } from "@interface/app.types";
import { DataSchemaField, OdfTypes } from "@interface/dataset-schema.interface";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { MetadataBlockInfo } from "src/app/dataset-block/metadata-block/metadata-block.types";
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

        const metadataBlock$ = service
            .requestMetadataBlock(mockDatasetInfo, TEST_BLOCK_HASH)
            .subscribe((result: MaybeUndefined<MetadataBlockInfo>) => {
                if (result) {
                    expect(result.blockAsYaml).toEqual(
                        mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain.blockByHashEncoded as string,
                    );
                }
            });

        expect(metadataBlock$.closed).toBeTrue();
    });

    describe("getPollingSourceSchemaFields", () => {
        const odfJsonContent = JSON.stringify({
            fields: [
                { name: "id", type: { kind: "Int32" } },
                { name: "name", type: { kind: "String" } },
            ],
        });

        function mockProjection(schemaContent: string | null): DatasetBlocksSchemaByEventTypeQuery {
            return {
                datasets: {
                    byOwnerAndName: {
                        metadata: {
                            metadataProjection: [
                                {
                                    __typename: "MetadataBlockExtended",
                                    event: {
                                        __typename: "SetPollingSource",
                                        read: {
                                            __typename: "ReadStepCsv",
                                            schema: schemaContent
                                                ? {
                                                      __typename: "DataSchema",
                                                      content: schemaContent,
                                                      format: "ODF_JSON" as never,
                                                  }
                                                : null,
                                        } as never,
                                        fetch: {} as never,
                                        merge: {} as never,
                                    },
                                },
                            ],
                        },
                    },
                },
            } as DatasetBlocksSchemaByEventTypeQuery;
        }

        it("should extract DataSchemaField[] from a GQL SetPollingSource event", () => {
            const spy = spyOn(datasetApi, "getSchemaFieldsByEventType").and.returnValue(
                of(mockProjection(odfJsonContent)),
            );
            const expected: DataSchemaField[] = [
                { name: "id", type: { kind: OdfTypes.Int32 } },
                { name: "name", type: { kind: OdfTypes.String } },
            ];

            let result: DataSchemaField[] = [];
            service
                .getPollingSourceSchemaFields({
                    accountName: mockDatasetInfo.accountName,
                    datasetName: mockDatasetInfo.datasetName,
                })
                .subscribe((fields) => (result = fields));

            expect(spy).toHaveBeenCalledWith(
                jasmine.objectContaining({ eventTypes: [MetadataEventType.SetPollingSource] }),
            );
            expect(result).toEqual(expected);
        });

        it("should return [] when the block has no schema", () => {
            spyOn(datasetApi, "getSchemaFieldsByEventType").and.returnValue(of(mockProjection(null)));

            let result: DataSchemaField[] = [{ name: "sentinel", type: { kind: OdfTypes.String } }];
            service
                .getPollingSourceSchemaFields({
                    accountName: mockDatasetInfo.accountName,
                    datasetName: mockDatasetInfo.datasetName,
                })
                .subscribe((fields) => (result = fields));

            expect(result).toEqual([]);
        });

        it("should return [] when metadataProjection is empty", () => {
            spyOn(datasetApi, "getSchemaFieldsByEventType").and.returnValue(
                of({
                    datasets: { byOwnerAndName: { metadata: { metadataProjection: [] } } },
                } as unknown as DatasetBlocksSchemaByEventTypeQuery),
            );

            let result: DataSchemaField[] = [{ name: "sentinel", type: { kind: OdfTypes.String } }];
            service
                .getPollingSourceSchemaFields({
                    accountName: mockDatasetInfo.accountName,
                    datasetName: mockDatasetInfo.datasetName,
                })
                .subscribe((fields) => (result = fields));

            expect(result).toEqual([]);
        });
    });

    describe("getAddPushSourceSchemaFields", () => {
        const odfJsonContent = JSON.stringify({
            fields: [{ name: "amount", type: { kind: "Float64" } }],
        });

        function mockPushProjection(schemaContent: string | null): DatasetBlocksSchemaByEventTypeQuery {
            return {
                datasets: {
                    byOwnerAndName: {
                        metadata: {
                            metadataProjection: [
                                {
                                    __typename: "MetadataBlockExtended",
                                    event: {
                                        __typename: "AddPushSource",
                                        sourceName: "my-source",
                                        read: {
                                            __typename: "ReadStepCsv",
                                            schema: schemaContent
                                                ? {
                                                      __typename: "DataSchema",
                                                      content: schemaContent,
                                                      format: "ODF_JSON" as never,
                                                  }
                                                : null,
                                        } as never,
                                        merge: {} as never,
                                    },
                                },
                            ],
                        },
                    },
                },
            } as DatasetBlocksSchemaByEventTypeQuery;
        }

        it("should extract DataSchemaField[] from an AddPushSource event", () => {
            const spy = spyOn(datasetApi, "getSchemaFieldsByEventType").and.returnValue(
                of(mockPushProjection(odfJsonContent)),
            );
            const expected: DataSchemaField[] = [{ name: "amount", type: { kind: OdfTypes.Float64 } }];

            let result: DataSchemaField[] = [];
            service
                .getAddPushSourceSchemaFields({
                    accountName: mockDatasetInfo.accountName,
                    datasetName: mockDatasetInfo.datasetName,
                    sourceName: "my-source",
                })
                .subscribe((fields) => (result = fields));

            expect(spy).toHaveBeenCalledWith(
                jasmine.objectContaining({ eventTypes: [MetadataEventType.AddPushSource] }),
            );
            expect(result).toEqual(expected);
        });

        it("should return [] when metadataProjection is empty", () => {
            spyOn(datasetApi, "getSchemaFieldsByEventType").and.returnValue(
                of({
                    datasets: { byOwnerAndName: { metadata: { metadataProjection: [] } } },
                } as unknown as DatasetBlocksSchemaByEventTypeQuery),
            );

            let result: DataSchemaField[] = [{ name: "sentinel", type: { kind: OdfTypes.String } }];
            service
                .getAddPushSourceSchemaFields({
                    accountName: mockDatasetInfo.accountName,
                    datasetName: mockDatasetInfo.datasetName,
                    sourceName: "my-source",
                })
                .subscribe((fields) => (result = fields));

            expect(result).toEqual([]);
        });
    });
});
