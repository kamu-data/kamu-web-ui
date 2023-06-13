import { MaybeNull } from "./../../../../../common/app.types";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { OWL_DATE_TIME_FORMATS } from "@danielmoncada/angular-datetime-picker";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import moment from "moment-timezone";
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
    public date: Date;
    public timeZone = this.currentTimeZone;

    constructor(
        public activeModal: NgbActiveModal,
        private yamlEventService: TemplatesYamlEventsService,
        private createDatasetService: AppDatasetCreateService,
    ) {
        super();
    }
    ngOnInit(): void {
        this.date = new Date();
    }

    public get isDateValid(): boolean {
        return moment(this.currentWatermark).isAfter(this.date);
    }

    public get currentTimeZone(): string {
        return moment.tz.guess();
    }

    private pad(value: number): string {
        return value < 10 ? "0" + value.toString() : value.toString();
    }

    public createOffset(date: Date): string {
        const sign = date.getTimezoneOffset() > 0 ? "-" : "+";
        const offset = Math.abs(date.getTimezoneOffset());
        const hours = this.pad(Math.floor(offset / 60));
        const minutes = this.pad(offset % 60);
        return sign.toString() + hours.toString() + ":" + minutes.toString();
    }

    public get minLocalWatermark(): string {
        return this.currentWatermark
            ? new Date(this.currentWatermark).toISOString()
            : "";
    }

    public commitSetWatermarkEvent(): void {
        const date = moment.utc(this.date).tz(this.timeZone).format();
        if (this.datasetBasics) {
            this.trackSubscription(
                this.createDatasetService
                    .commitEventToDataset(
                        this.datasetBasics.owner.name,
                        this.datasetBasics.name as string,
                        this.yamlEventService.buildYamlSetWatermarkEvent(date),
                    )
                    .subscribe(),
            );
        }
    }
}
