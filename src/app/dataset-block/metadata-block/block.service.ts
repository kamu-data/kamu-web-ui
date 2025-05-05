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
import { GetMetadataBlockQuery, MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/interface/app.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MetadataBlockInfo } from "./metadata-block.types";

@Injectable({
    providedIn: "root",
})
export class BlockService {
    private datasetApi = inject(DatasetApi);

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
}
