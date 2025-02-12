import { Observable } from "rxjs";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "../../api/kamu.graphql.interface";
import { inject } from "@angular/core";
import { DatasetService } from "../../dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "../../dataset-view/dataset.subscriptions.service";
import { BaseProcessingComponent } from "./base.processing.component";

export abstract class BaseDatasetDataComponent extends BaseProcessingComponent {
    protected datasetService = inject(DatasetService);
    protected datasetSubsService = inject(DatasetSubscriptionsService);

    protected datasetBasics$: Observable<DatasetBasicsFragment>;
    protected datasetPermissions$: Observable<DatasetPermissionsFragment>;
}
