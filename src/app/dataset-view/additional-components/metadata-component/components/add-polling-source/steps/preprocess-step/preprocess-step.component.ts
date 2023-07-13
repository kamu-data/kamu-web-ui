import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import {
    ControlContainer,
    FormArray,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
} from "@angular/forms";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import {
    EditFormType,
    PreprocessKind,
} from "../../add-polling-source-form.types";
import { MaybeNull } from "src/app/common/app.types";
import { EditPollingSourceService } from "../../edit-polling-source.service";
import { SqlQueryStep } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-preprocess-step",
    templateUrl: "./preprocess-step.component.html",
    styleUrls: ["./preprocess-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprocessStepComponent implements OnInit {
    public isAddPreprocessStep = false;
    @Input() public pollingSourceForm: FormGroup;
    @Input() public eventYamlByHash: MaybeNull<string> = null;
    public selectedEngine: string;
    public setPollingSourceEvent: MaybeNull<EditFormType> = null;
    public queries: Omit<SqlQueryStep, "__typename">[] = [];
    private readonly DEFAULT_PREPROCESS_KIND = PreprocessKind.SQL;

    constructor(
        private fb: FormBuilder,
        private editService: EditPollingSourceService,
    ) {}

    ngOnInit(): void {
        if (this.eventYamlByHash) {
            this.setPollingSourceEvent = this.editService.parseEventFromYaml(
                this.eventYamlByHash,
            );
            if (this.setPollingSourceEvent.preprocess?.engine) {
                this.isAddPreprocessStep = true;
                this.initDefaultQueriesSection(
                    this.setPollingSourceEvent.preprocess.query,
                );
                this.preprocessForm.patchValue({
                    engine: this.setPollingSourceEvent.preprocess.engine,
                });

                if (this.preprocessQueries.length == 0) {
                    this.preprocessQueries.push(
                        this.fb.group({
                            alias: "",
                            query: this.setPollingSourceEvent.preprocess.query,
                        }),
                    );
                }
            } else {
                this.initDefaultQueriesSection();
            }
        }
    }

    public get preprocessForm(): FormGroup {
        return this.pollingSourceForm.get(
            SetPollingSourceSection.PREPROCESS,
        ) as FormGroup;
    }

    public get preprocessQueries(): FormArray {
        return this.pollingSourceForm.get("preprocess.queries") as FormArray;
    }

    public onCheckedPreprocessStep(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            this.pollingSourceForm.addControl(
                SetPollingSourceSection.PREPROCESS,
                this.fb.group({
                    kind: this.DEFAULT_PREPROCESS_KIND,
                    engine: "",
                }),
            );
            if (this.setPollingSourceEvent?.preprocess) {
                this.preprocessForm.patchValue({
                    engine: this.setPollingSourceEvent.preprocess.engine,
                });
            }
        } else {
            this.pollingSourceForm.removeControl(
                SetPollingSourceSection.PREPROCESS,
            );
        }
    }

    public onSelectEngine(engine: string): void {
        this.selectedEngine = engine.toUpperCase();
        this.preprocessForm.patchValue({
            engine: engine.toLowerCase(),
        });
    }

    private initDefaultQueriesSection(query = ""): void {
        this.queries = [...this.queries, { alias: "", query }];
    }
}
