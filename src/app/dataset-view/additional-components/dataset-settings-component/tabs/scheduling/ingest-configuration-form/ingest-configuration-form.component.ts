import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { IngestConfigurationFormType } from "../dataset-settings-scheduling-tab.component.types";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetBasicsFragment, DatasetFlowType, GetDatasetFlowConfigsQuery } from "src/app/api/kamu.graphql.interface";
import { DatasetSchedulingService } from "../../../services/dataset-scheduling.service";

@Component({
    selector: "app-ingest-configuration-form",
    templateUrl: "./ingest-configuration-form.component.html",
    styleUrls: ["./ingest-configuration-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngestConfigurationFormComponent extends BaseComponent implements OnInit, OnChanges {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public disabled: boolean;
    @Output() public changeConfigurationEmit = new EventEmitter<FormGroup<IngestConfigurationFormType>>();

    private datasetSchedulingService = inject(DatasetSchedulingService);

    public ingestConfigurationForm = new FormGroup<IngestConfigurationFormType>({
        fetchUncacheable: new FormControl<boolean>(false, { nonNullable: true }),
    });

    public ngOnInit(): void {
        this.datasetSchedulingService
            .fetchDatasetFlowConfigs(this.datasetBasics.id, DatasetFlowType.Ingest)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data: GetDatasetFlowConfigsQuery) => {
                const flowConfiguration = data.datasets.byId?.flows.configs.byType?.ingest;
                this.ingestConfigurationForm.patchValue({
                    fetchUncacheable: flowConfiguration?.fetchUncacheable ?? false,
                });
            });
        this.changeIngestConfiguration();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.disabled && changes.disabled.currentValue) {
            this.ingestConfigurationForm.enable();
        } else if (changes.disabled && !changes.disabled.currentValue) {
            this.ingestConfigurationForm.disable();
        }
    }

    public changeIngestConfiguration(): void {
        this.ingestConfigurationForm.valueChanges.subscribe(() => {
            this.changeConfigurationEmit.emit(this.ingestConfigurationForm);
        });
    }
}
