import { inject } from "@angular/core";
import { ActivatedRoute, ParamMap, Params } from "@angular/router";
import { DatasetInfo } from "../interface/navigation.interface";
import ProjectLinks from "../project-links";
import { requireValue } from "./app.helpers";
import { UnsubscribeOnDestroyAdapter } from "./unsubscribe.ondestroy.adapter";
import { Observable, map } from "rxjs";

export abstract class BaseComponent extends UnsubscribeOnDestroyAdapter {
    protected activatedRoute = inject(ActivatedRoute);

    public get searchString(): string {
        return window.location.search;
    }

    public getDatasetInfoFromUrl(): DatasetInfo {
        const paramMap: ParamMap = this.activatedRoute.snapshot.paramMap;
        return {
            // Both parameters are mandatory in URL, router would not activate this component otherwise
            accountName: requireValue(paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME)),
            datasetName: requireValue(paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME)),
        };
    }

    public get datasetInfoFromUrl(): Observable<DatasetInfo> {
        return this.activatedRoute.params.pipe(
            map((params: Params) => {
                return {
                    // Both parameters are mandatory in URL, router would not activate this component otherwise
                    accountName: requireValue(params[ProjectLinks.URL_PARAM_ACCOUNT_NAME] as string),
                    datasetName: requireValue(params[ProjectLinks.URL_PARAM_DATASET_NAME] as string),
                };
            }),
        );
    }
}
