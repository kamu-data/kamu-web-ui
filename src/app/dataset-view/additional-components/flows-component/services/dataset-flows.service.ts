import { Injectable } from "@angular/core";
import { Observable, Subject, map } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    FlowConnection,
    FlowConnectionDataFragment,
    GetDatasetListFlowsQuery,
} from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/common/app.types";

@Injectable({
    providedIn: "root",
})
export class DatasetFlowsService {
    constructor(private datasetFlowApi: DatasetFlowApi) {}

    private flowConnectionChanges$: Subject<FlowConnection> = new Subject<FlowConnection>();

    public get flowConnectionChanges(): Observable<FlowConnection> {
        return this.flowConnectionChanges$.asObservable();
    }

    public emitFlowConnectionChanged(flow: FlowConnection): void {
        this.flowConnectionChanges$.next(flow);
    }

    public datasetFlowsList(params: {
        datasetId: string;
        page: number;
        perPage: number;
    }): Observable<MaybeUndefined<FlowConnectionDataFragment>> {
        return this.datasetFlowApi.getDatasetListFlows(params).pipe(
            map((data: GetDatasetListFlowsQuery) => {
                return data.datasets.byId?.flows.runs.listFlows;
            }),
        );
    }
}
