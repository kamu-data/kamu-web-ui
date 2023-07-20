import { inject } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { DatasetInfo } from "../interface/navigation.interface";
import ProjectLinks from "../project-links";
import { requireValue } from "./app.helpers";
import { UnsubscribeOnDestroyAdapter } from "./unsubscribe.ondestroy.adapter";

export abstract class BaseComponent extends UnsubscribeOnDestroyAdapter {
    public activatedRoute = inject(ActivatedRoute);

    public get searchString(): string {
        return window.location.search;
    }

    public getDatasetInfoFromUrl(): DatasetInfo {
        const paramMap: ParamMap = this.activatedRoute.snapshot.paramMap;
        return {
            // Both parameters are mandatory in URL, router would not activate this component otherwise
            accountName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
            ),
            datasetName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
            ),
        };
    }
}
