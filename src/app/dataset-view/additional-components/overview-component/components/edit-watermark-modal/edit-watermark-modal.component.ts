import { MaybeNull } from "./../../../../../common/app.types";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { OWL_DATE_TIME_FORMATS } from "@danielmoncada/angular-datetime-picker";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { MY_MOMENT_FORMATS } from "src/app/common/data.helpers";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";

@Component({
    selector: "app-edit-watermark-modal",
    templateUrl: "./edit-watermark-modal.component.html",
    styleUrls: ["./edit-watermark-modal.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    ],
})
export class EditWatermarkModalComponent
    extends BaseComponent
    implements OnInit
{
    @Input() public currentWatermark: MaybeNull<string>;
    @Input() public datasetBasics?: DatasetBasicsFragment;
    public date: Date | string;

    constructor(
        public activeModal: NgbActiveModal,
        private yamlEventService: TemplatesYamlEventsService,
        private createDatasetService: AppDatasetCreateService,
    ) {
        super();
    }
    ngOnInit(): void {
        this.date = this.currentWatermark ? this.currentWatermark : new Date();
    }

    public commitSetWatermarkEvent(): void {
        if (this.datasetBasics) {
            this.trackSubscription(
                this.createDatasetService
                    .commitEventToDataset(
                        this.datasetBasics.owner.name,
                        this.datasetBasics.name as string,
                        this.yamlEventService.buildYamlSetWatermarkEvent(
                            JSON.stringify(this.date),
                        ),
                    )
                    .subscribe(),
            );
        }
    }
}
