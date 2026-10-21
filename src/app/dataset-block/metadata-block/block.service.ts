/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { extractSchemaFromReadStep } from "@common/helpers/data-schema.helpers";
import { DatasetApi } from "@api/dataset.api";
import {
    AddPushSource,
    GetMetadataBlockQuery,
    MetadataBlockExtended,
    MetadataEventType,
    MetadataManifestFormat,
} from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeNullOrUndefined, MaybeUndefined } from "@interface/app.types";
import { DataSchemaField } from "@interface/dataset-schema.interface";
import { DatasetInfo } from "@interface/navigation.interface";

import { MetadataBlockInfo } from "src/app/dataset-block/metadata-block/metadata-block.types";

@Injectable({
    providedIn: "root",
})
export class BlockService {
    public sourceNames: string[] = [];
    private datasetApi = inject(DatasetApi);

    public requestMetadataBlock(info: DatasetInfo, blockHash: string): Observable<MaybeUndefined<MetadataBlockInfo>> {
        return this.datasetApi.getBlockByHash({ ...info, blockHash }).pipe(
            map((data: GetMetadataBlockQuery) => {
                const metadata = data.datasets.byOwnerAndName?.metadata;
                const block = metadata?.chain.blockByHash;
                if (metadata && block) {
                    return {
                        block,
                        blockAsYaml: metadata.chain.blockByHashEncoded as string,
                        downstreamsCount: metadata.currentDownstreamDependenciesCount,
                    };
                }
            }),
        );
    }

    public requestSystemTimeBlockByHash(datasetId: string, blockHash: string): Observable<Date> {
        return this.datasetApi.getSystemTimeBlockByHash(datasetId, blockHash).pipe(
            map((data) => {
                return new Date(data.datasets.byId?.metadata.chain.blockByHash?.systemTime ?? "");
            }),
        );
    }

    public getPollingSourceBlock(params: {
        accountName: string;
        datasetName: string;
        encoding: MetadataManifestFormat;
    }): Observable<MaybeNull<string>> {
        return this.datasetApi
            .getBlocksByEventType({ ...params, eventTypes: [MetadataEventType.SetPollingSource] })
            .pipe(
                map((data) => {
                    const blocks = data.datasets.byOwnerAndName?.metadata.metadataProjection as MetadataBlockExtended[];
                    return blocks.length ? (blocks[0].encoded?.content as string) : null;
                }),
            );
    }

    public getSetTransformBlock(params: {
        accountName: string;
        datasetName: string;
        encoding: MetadataManifestFormat;
    }): Observable<MaybeNull<string>> {
        return this.datasetApi.getBlocksByEventType({ ...params, eventTypes: [MetadataEventType.SetTransform] }).pipe(
            map((data) => {
                const blocks = data.datasets.byOwnerAndName?.metadata.metadataProjection as MetadataBlockExtended[];
                return blocks.length ? (blocks[0].encoded?.content as string) : null;
            }),
        );
    }

    /**
     * Emits the encoded block of the named push source, `undefined` when the dataset has no
     * source with that name, and `null` when no name is given.
     */
    public getAddPushSourceBlock(params: {
        accountName: string;
        datasetName: string;
        sourceName: string;
        encoding: MetadataManifestFormat;
    }): Observable<MaybeNullOrUndefined<string>> {
        return this.datasetApi.getBlocksByEventType({ ...params, eventTypes: [MetadataEventType.AddPushSource] }).pipe(
            map((data) => {
                const blocks = data.datasets.byOwnerAndName?.metadata.metadataProjection as MetadataBlockExtended[];
                this.sourceNames = blocks.map((item) => (item.event as AddPushSource).sourceName);
                if (params.sourceName) {
                    const block = blocks.find(
                        (item) =>
                            item.event.__typename === "AddPushSource" && item.event.sourceName === params.sourceName,
                    );
                    return block ? block.encoded?.content : undefined;
                } else {
                    return null;
                }
            }),
        );
    }

    public getPollingSourceSchemaFields(params: {
        accountName: string;
        datasetName: string;
    }): Observable<DataSchemaField[]> {
        return this.datasetApi
            .getSchemaFieldsByEventType({ ...params, eventTypes: [MetadataEventType.SetPollingSource] })
            .pipe(
                map((data) => {
                    const blocks = data.datasets.byOwnerAndName?.metadata.metadataProjection ?? [];
                    if (!blocks.length) return [];
                    const event = blocks[0].event;
                    if (event.__typename !== "SetPollingSource") return [];
                    return extractSchemaFromReadStep(event.read);
                }),
            );
    }

    public getAddPushSourceSchemaFields(params: {
        accountName: string;
        datasetName: string;
        sourceName: string;
    }): Observable<DataSchemaField[]> {
        return this.datasetApi
            .getSchemaFieldsByEventType({ ...params, eventTypes: [MetadataEventType.AddPushSource] })
            .pipe(
                map((data) => {
                    const blocks = data.datasets.byOwnerAndName?.metadata.metadataProjection ?? [];
                    const block = blocks.find(
                        (b) => b.event.__typename === "AddPushSource" && b.event.sourceName === params.sourceName,
                    );
                    if (!block) return [];
                    const event = block.event;
                    if (event.__typename !== "AddPushSource") return [];
                    return extractSchemaFromReadStep(event.read);
                }),
            );
    }
}
