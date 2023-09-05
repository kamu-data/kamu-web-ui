import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DatasetApi } from "src/app/api/dataset.api";
import { GetMetadataBlockQuery, MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/common/app.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Injectable({
    providedIn: "root",
})
export class BlockService {
    constructor(private datasetApi: DatasetApi) {}

    public currentBlock: MetadataBlockFragment;

    private metadataBlockChanges$: Subject<MetadataBlockFragment> = new Subject<MetadataBlockFragment>();

    public get onMetadataBlockChanges(): Observable<MetadataBlockFragment> {
        return this.metadataBlockChanges$.asObservable();
    }

    public metadataBlockChanges(block: MetadataBlockFragment): void {
        this.metadataBlockChanges$.next(block);
    }

    private metadataBlockAsYamlChanges$: Subject<string> = new Subject<string>();

    public get onMetadataBlockAsYamlChanges(): Observable<string> {
        return this.metadataBlockAsYamlChanges$.asObservable();
    }

    public metadataBlockAsYamlChanges(block: string): void {
        this.metadataBlockAsYamlChanges$.next(block);
    }

    public requestMetadataBlock(info: DatasetInfo, blockHash: string): Observable<void> {
        return this.datasetApi.getBlockByHash({ ...info, blockHash }).pipe(
            map((data: GetMetadataBlockQuery) => {
                if (data.datasets.byOwnerAndName) {
                    this.currentBlock = data.datasets.byOwnerAndName.metadata.chain
                        .blockByHash as MetadataBlockFragment;
                    const blockAsYaml = data.datasets.byOwnerAndName.metadata.chain
                        .blockByHashEncoded as MaybeUndefined<string>;
                    this.metadataBlockChanges(this.currentBlock);
                    if (blockAsYaml) {
                        this.metadataBlockAsYamlChanges(blockAsYaml);
                    }
                }
            }),
        );
    }
}
