/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DatasetApi } from "src/app/api/dataset.api";
import {
    AddPushSource,
    GetMetadataBlockQuery,
    MetadataBlockFragment,
    MetadataEventType,
    MetadataManifestFormat,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MetadataBlockInfo } from "./metadata-block.types";
import { MetadataBlockExtended } from "./../../api/kamu.graphql.interface";
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

    public requestBlocksByPollingSourceEvent(params: {
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

    public requestBlocksBySetTransformEvent(params: {
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

    public requestBlocksByAddPushSourceEvent(params: {
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
}
