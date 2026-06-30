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
    AddPushSourceEventFragment,
    GetMetadataBlockQuery,
    MetadataBlockExtended,
    MetadataBlockFragment,
    MetadataEventType,
    MetadataManifestFormat,
    SetPollingSourceEventFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";
import { DataSchemaField } from "@interface/dataset-schema.interface";
import { DatasetInfo } from "@interface/navigation.interface";

import { MetadataBlockInfo } from "src/app/dataset-block/metadata-block/metadata-block.types";
import { NavigationService } from "src/app/services/navigation.service";

@Injectable({
    providedIn: "root",
})
export class BlockService {
    public sourceNames: string[] = [];
    private datasetApi = inject(DatasetApi);
    private navigationService = inject(NavigationService);

    public requestMetadataBlock(info: DatasetInfo, blockHash: string): Observable<MaybeUndefined<MetadataBlockInfo>> {
        return this.datasetApi.getBlockByHash({ ...info, blockHash }).pipe(
            map((data: GetMetadataBlockQuery) => {
                if (data.datasets.byOwnerAndName) {
                    const block = data.datasets.byOwnerAndName.metadata.chain.blockByHash as MetadataBlockFragment;
                    const blockAsYaml = data.datasets.byOwnerAndName.metadata.chain.blockByHashEncoded as string;
                    const downstreamsCount = data.datasets.byOwnerAndName.metadata.currentDownstreamDependencies.length;
                    return { block, blockAsYaml, downstreamsCount };
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

    public getAddPushSourceBlock(params: {
        accountName: string;
        datasetName: string;
        sourceName: string;
        encoding: MetadataManifestFormat;
    }): Observable<MaybeNull<string>> {
        return this.datasetApi.getBlocksByEventType({ ...params, eventTypes: [MetadataEventType.AddPushSource] }).pipe(
            map((data) => {
                const blocks = data.datasets.byOwnerAndName?.metadata.metadataProjection as MetadataBlockExtended[];
                this.sourceNames = blocks.map((item) => (item.event as AddPushSource).sourceName);
                if (params.sourceName) {
                    if (!this.sourceNames.includes(params.sourceName)) {
                        this.navigationService.navigateToPageNotFound();
                    }
                    const block = blocks.filter(
                        (item) =>
                            item.event.__typename === "AddPushSource" && item.event.sourceName === params.sourceName,
                    )[0];
                    return block.encoded?.content as string;
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
            .getBlocksByEventType({
                ...params,
                eventTypes: [MetadataEventType.SetPollingSource],
                encoding: MetadataManifestFormat.Yaml,
            })
            .pipe(
                map((data) => {
                    const blocks = data.datasets.byOwnerAndName?.metadata.metadataProjection ?? [];
                    if (!blocks.length) return [];
                    const event = blocks[0].event as SetPollingSourceEventFragment;
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
            .getBlocksByEventType({
                ...params,
                eventTypes: [MetadataEventType.AddPushSource],
                encoding: MetadataManifestFormat.Yaml,
            })
            .pipe(
                map((data) => {
                    const blocks = data.datasets.byOwnerAndName?.metadata.metadataProjection ?? [];
                    const block = blocks.find(
                        (b) => b.event.__typename === "AddPushSource" && b.event.sourceName === params.sourceName,
                    );
                    if (!block) return [];
                    const event = block.event as AddPushSourceEventFragment;
                    return extractSchemaFromReadStep(event.read);
                }),
            );
    }
}
