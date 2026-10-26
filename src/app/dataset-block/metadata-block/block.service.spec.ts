/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of } from "rxjs";

import { Apollo } from "apollo-angular";

import { requireValue } from "@common/helpers/app.helpers";
import { DatasetApi } from "@api/dataset.api";
import {
    DataSchemaFormat,
    DatasetBlocksEncodedByEventTypeQuery,
    DatasetBlocksSchemaByEventTypeQuery,
    MetadataEventType,
    MetadataManifestFormat,
    ReadStepCsvDataFragment,
} from "@api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery, TEST_BLOCK_HASH } from "@api/mock/dataset.mock";
import { MaybeNull, MaybeNullOrUndefined } from "@interface/app.types";
import { DataSchemaField, OdfTypes } from "@interface/dataset-schema.interface";

import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { mockDatasetInfo } from "src/app/search/mock.data";

describe("BlockService", () => {
    let service: BlockService;
    let datasetApi: DatasetApi;

    function csvReadStep(schemaContent: MaybeNull<string>): { __typename: "ReadStepCsv" } & ReadStepCsvDataFragment {
        return {
            __typename: "ReadStepCsv",
            schema: schemaContent
                ? { __typename: "DataSchema", content: schemaContent, format: DataSchemaFormat.OdfJson }
                : null,
        };
    }

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

    it("should check get block from api", async () => {
        spyOn(datasetApi, "getBlockByHash").and.returnValue(of(mockGetMetadataBlockQuery));
        const metadata = requireValue(mockGetMetadataBlockQuery.datasets.byOwnerAndName ?? null).metadata;

        const result = await firstValueFrom(service.requestMetadataBlock(mockDatasetInfo, TEST_BLOCK_HASH));

        expect(result).toEqual({
            block: requireValue(metadata.chain.blockByHash ?? null),
            blockAsYaml: requireValue(metadata.chain.blockByHashEncoded ?? null),
            downstreamsCount: metadata.currentDownstreamDependenciesCount,
        });
    });

    it("should emit nothing usable for a block hash the dataset does not have", async () => {
        const dataset = requireValue(mockGetMetadataBlockQuery.datasets.byOwnerAndName ?? null);
        spyOn(datasetApi, "getBlockByHash").and.returnValue(
            of({
                ...mockGetMetadataBlockQuery,
                datasets: {
                    ...mockGetMetadataBlockQuery.datasets,
                    byOwnerAndName: {
                        ...dataset,
                        metadata: { ...dataset.metadata, chain: { ...dataset.metadata.chain, blockByHash: null } },
                    },
                },
            }),
        );

        const result = await firstValueFrom(service.requestMetadataBlock(mockDatasetInfo, TEST_BLOCK_HASH));

        expect(result).toBeUndefined();
    });

    describe("getPollingSourceSchemaFields", () => {
        const odfJsonContent = JSON.stringify({
            fields: [
                { name: "id", type: { kind: "Int32" } },
                { name: "name", type: { kind: "String" } },
            ],
        });

        function mockProjection(schemaContent: MaybeNull<string>): DatasetBlocksSchemaByEventTypeQuery {
            return {
                datasets: {
                    byOwnerAndName: {
                        metadata: {
                            metadataProjection: [
                                {
                                    __typename: "MetadataBlockExtended",
                                    event: {
                                        __typename: "SetPollingSource",
                                        read: csvReadStep(schemaContent),
                                        fetch: { __typename: "FetchStepUrl", url: "https://example.com/data.csv" },
                                        merge: { __typename: "MergeStrategyAppend" },
                                    },
                                },
                            ],
                        },
                    },
                },
            };
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
            const emptyQuery: DatasetBlocksSchemaByEventTypeQuery = {
                datasets: { byOwnerAndName: { metadata: { metadataProjection: [] } } },
            };
            spyOn(datasetApi, "getSchemaFieldsByEventType").and.returnValue(of(emptyQuery));

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

        function mockPushProjection(schemaContent: MaybeNull<string>): DatasetBlocksSchemaByEventTypeQuery {
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
                                        read: csvReadStep(schemaContent),
                                        merge: { __typename: "MergeStrategyAppend" },
                                    },
                                },
                            ],
                        },
                    },
                },
            };
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
            const emptyQuery: DatasetBlocksSchemaByEventTypeQuery = {
                datasets: { byOwnerAndName: { metadata: { metadataProjection: [] } } },
            };
            spyOn(datasetApi, "getSchemaFieldsByEventType").and.returnValue(of(emptyQuery));

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

        // Regression test: with multiple AddPushSource blocks in the projection, the
        // method must pick the block matching params.sourceName, not just the first
        // AddPushSource block — otherwise editing one source can load another's schema.
        it("should return the schema for the requested source when multiple push sources exist", () => {
            const multiSourceQuery: DatasetBlocksSchemaByEventTypeQuery = {
                datasets: {
                    byOwnerAndName: {
                        metadata: {
                            metadataProjection: [
                                {
                                    __typename: "MetadataBlockExtended",
                                    event: {
                                        __typename: "AddPushSource",
                                        sourceName: "source-a",
                                        read: csvReadStep(
                                            JSON.stringify({
                                                fields: [{ name: "a_field", type: { kind: "String" } }],
                                            }),
                                        ),
                                        merge: { __typename: "MergeStrategyAppend" },
                                    },
                                },
                                {
                                    __typename: "MetadataBlockExtended",
                                    event: {
                                        __typename: "AddPushSource",
                                        sourceName: "source-b",
                                        read: csvReadStep(
                                            JSON.stringify({
                                                fields: [{ name: "b_field", type: { kind: "Int32" } }],
                                            }),
                                        ),
                                        merge: { __typename: "MergeStrategyAppend" },
                                    },
                                },
                            ],
                        },
                    },
                },
            };
            spyOn(datasetApi, "getSchemaFieldsByEventType").and.returnValue(of(multiSourceQuery));

            let result: DataSchemaField[] = [];
            service
                .getAddPushSourceSchemaFields({
                    accountName: mockDatasetInfo.accountName,
                    datasetName: mockDatasetInfo.datasetName,
                    sourceName: "source-b",
                })
                .subscribe((fields) => (result = fields));

            expect(result).toEqual([{ name: "b_field", type: { kind: OdfTypes.Int32 } }]);
        });
    });

    describe("getAddPushSourceBlock", () => {
        const mockBlocksEncodedByEventTypeQuery: DatasetBlocksEncodedByEventTypeQuery = {
            datasets: {
                byOwnerAndName: {
                    metadata: {
                        metadataProjection: [
                            {
                                __typename: "MetadataBlockExtended",
                                encoded: { __typename: "EncodedBlock", content: "kind: AddPushSource # source-a" },
                                event: { __typename: "AddPushSource", sourceName: "source-a" },
                            },
                            {
                                __typename: "MetadataBlockExtended",
                                encoded: { __typename: "EncodedBlock", content: "kind: AddPushSource # source-b" },
                                event: { __typename: "AddPushSource", sourceName: "source-b" },
                            },
                        ],
                    },
                },
            },
        };

        function requestBlock(sourceName: string): Promise<MaybeNullOrUndefined<string>> {
            return firstValueFrom(
                service.getAddPushSourceBlock({
                    accountName: mockDatasetInfo.accountName,
                    datasetName: mockDatasetInfo.datasetName,
                    sourceName,
                    encoding: MetadataManifestFormat.Yaml,
                }),
            );
        }

        let getBlocksByEventTypeSpy: jasmine.Spy;

        beforeEach(() => {
            getBlocksByEventTypeSpy = spyOn(datasetApi, "getBlocksByEventType").and.returnValue(
                of(mockBlocksEncodedByEventTypeQuery),
            );
        });

        it("should emit the encoded block of the named source", async () => {
            const result = await requestBlock("source-b");

            expect(getBlocksByEventTypeSpy).toHaveBeenCalledOnceWith(
                jasmine.objectContaining({
                    accountName: mockDatasetInfo.accountName,
                    datasetName: mockDatasetInfo.datasetName,
                    encoding: MetadataManifestFormat.Yaml,
                    eventTypes: [MetadataEventType.AddPushSource],
                }),
            );
            expect(result).toEqual("kind: AddPushSource # source-b");
            expect(service.sourceNames).toEqual(["source-a", "source-b"]);
        });

        it("should emit undefined for an unknown source name", async () => {
            const result = await requestBlock("unknown-source");

            expect(result).toBeUndefined();
            expect(service.sourceNames).toEqual(["source-a", "source-b"]);
        });

        it("should emit null when no source name is given", async () => {
            const result = await requestBlock("");

            expect(result).toBeNull();
            expect(service.sourceNames).toEqual(["source-a", "source-b"]);
        });
    });
});
