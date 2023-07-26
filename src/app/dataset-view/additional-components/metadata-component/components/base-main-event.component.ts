import { ChangeDetectorRef, inject } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";

export abstract class BaseMainEventComponent extends BaseComponent {
    public modalService = inject(NgbModal);
    public createDatasetService = inject(AppDatasetCreateService);
    public cdr = inject(ChangeDetectorRef);
    public yamlEventService = inject(TemplatesYamlEventsService);

    public eventYamlByHash: MaybeNull<string>;
    public history: DatasetHistoryUpdate;
    public datasetKind: DatasetKind;
    public errorMessage = "";
    public changedEventYamlByHash: string;

    protected subsribeErrorMessage(): void {
        this.trackSubscription(
            this.createDatasetService.onErrorCommitEventChanges.subscribe(
                (message: string) => {
                    this.errorMessage = message;
                    this.cdr.detectChanges();
                },
            ),
        );
    }

    protected abstract onEditYaml(): void;
    protected abstract onSaveEvent(): void;
}
