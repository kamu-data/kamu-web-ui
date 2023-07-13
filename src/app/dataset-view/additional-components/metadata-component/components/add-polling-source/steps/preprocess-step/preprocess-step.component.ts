import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
    EditFormType,
    PreprocessStepValue,
} from "../../add-polling-source-form.types";
import { MaybeNull } from "src/app/common/app.types";
import { EditPollingSourceService } from "../../edit-polling-source.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-preprocess-step",
    templateUrl: "./preprocess-step.component.html",
    styleUrls: ["./preprocess-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprocessStepComponent implements OnInit {
    @Input() public isShowPreprocessStep: boolean;
    @Input() public pollingSourceForm: FormGroup;
    @Input() public eventYamlByHash: MaybeNull<string> = null;
    @Input() public preprocessValue: PreprocessStepValue;
    @Output() public showPreprcessStepEmitter = new EventEmitter<boolean>();
    public setPollingSourceEvent: MaybeNull<EditFormType> = null;

    constructor(
        private editService: EditPollingSourceService,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        if (this.eventYamlByHash) {
            this.setPollingSourceEvent = this.editService.parseEventFromYaml(
                this.eventYamlByHash,
            );
            if (this.setPollingSourceEvent.preprocess) {
                this.showPreprcessStepEmitter.emit(true);
                this.initExistingQueries();
            } else {
                this.initDefaultQueriesSection();
            }
        }
    }

    public onSelectEngine(engine: string): void {
        this.preprocessValue.engine = engine;
    }

    public getDatasetInfoFromUrl(): DatasetInfo {
        const paramMap: ParamMap = this.activatedRoute.snapshot.paramMap;
        return {
            accountName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
            ),
            datasetName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
            ),
        };
    }

    public onCheckedPreprocessStep(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            this.showPreprcessStepEmitter.emit(true);
        } else {
            this.showPreprcessStepEmitter.emit(false);
        }
    }

    private initDefaultQueriesSection(query = ""): void {
        if (!this.preprocessValue.queries.length) {
            this.preprocessValue.queries.push({
                alias: this.getDatasetInfoFromUrl().datasetName,
                query,
            });
        }
    }

    private initExistingQueries(): void {
        if (this.preprocessValue.queries.length === 0) {
            if (this.setPollingSourceEvent?.preprocess?.query) {
                this.initDefaultQueriesSection(
                    this.setPollingSourceEvent.preprocess.query,
                );
            } else if (this.setPollingSourceEvent?.preprocess?.queries.length) {
                this.preprocessValue.queries =
                    this.setPollingSourceEvent.preprocess.queries;
            }
        }
    }
}
