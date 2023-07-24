import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import {
    EditFormType,
    PreprocessStepValue,
} from "../../add-polling-source-form.types";
import { MaybeNull } from "src/app/common/app.types";
import { EditPollingSourceService } from "../../edit-polling-source.service";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-preprocess-step",
    templateUrl: "./preprocess-step.component.html",
    styleUrls: ["./preprocess-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprocessStepComponent extends BaseComponent implements OnInit {
    @Input() public showPreprocessStep: boolean;
    @Input() public eventYamlByHash: MaybeNull<string> = null;
    @Input() public preprocessValue: PreprocessStepValue;
    @Output() public showPreprocessStepEmitter = new EventEmitter<boolean>();
    public setPollingSourceEvent: MaybeNull<EditFormType> = null;

    constructor(private editService: EditPollingSourceService) {
        super();
    }

    ngOnInit(): void {
        if (this.eventYamlByHash) {
            this.setPollingSourceEvent = this.editService.parseEventFromYaml(
                this.eventYamlByHash,
            );
            if (this.setPollingSourceEvent.preprocess) {
                this.showPreprocessStepEmitter.emit(true);
                this.initExistingQueries();
            } else {
                this.initDefaultQueriesSection();
            }
        } else {
            this.initDefaultQueriesSection();
        }
    }

    public onSelectEngine(engine: string): void {
        this.preprocessValue.engine = engine;
    }

    public onCheckedPreprocessStep(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.showPreprocessStepEmitter.emit(input.checked);
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
