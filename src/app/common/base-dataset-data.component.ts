import { Observable } from "rxjs";
import { BaseProcessingComponent } from "./base.processing.component";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "../api/kamu.graphql.interface";
import { inject } from "@angular/core";
import { DatasetService } from "../dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "../dataset-view/dataset.subscriptions.service";

export abstract class BaseDatasetDataComponent extends BaseProcessingComponent {
    protected datasetService = inject(DatasetService);
    protected datasetSubsService = inject(DatasetSubscriptionsService);

    public datasetBasics$: Observable<DatasetBasicsFragment>;
    public datasetPermissions$: Observable<DatasetPermissionsFragment>;
}
