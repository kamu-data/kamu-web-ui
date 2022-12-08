import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DatasetApi } from "src/app/api/dataset.api";
import {
    GetMetadataBlockQuery,
    MetadataBlockFragment,
} from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Injectable({
    providedIn: "root",
})
export class BlockService {
    constructor(private datasetApi: DatasetApi) {}

    private metadataBlockChanges$: Subject<MetadataBlockFragment> =
        new Subject<MetadataBlockFragment>();

    public get onMetadataBlockChanges(): Observable<MetadataBlockFragment> {
        return this.metadataBlockChanges$.asObservable();
    }

    public metadataBlockChanges(block: MetadataBlockFragment): void {
        this.metadataBlockChanges$.next(block);
    }

    public requestMetadataBlock(
        info: DatasetInfo,
        blockHash: string,
    ): Observable<void> {
        return this.datasetApi.getBlockByHash({ ...info, blockHash }).pipe(
            map((data: GetMetadataBlockQuery) => {
                if (data.datasets.byOwnerAndName) {
                    const block = data.datasets.byOwnerAndName.metadata.chain
                        .blockByHash as MetadataBlockFragment;
                    this.metadataBlockChanges(block);
                }
            }),
        );
    }
}
