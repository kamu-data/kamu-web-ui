import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "../../../../../common/base.component";
import { DatasetSettingsService } from "../../services/dataset-settings.service";
import { PollingGroupEnum, ThrottlingGroupEnum, SchedulingSettings } from "../../dataset-settings.model";
import { DatasetBasicsFragment, DatasetKind, DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-scheduling",
    templateUrl: "./scheduling.component.html",
    styleUrls: ["./scheduling.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;
    public readonly pollingGroupEnum: typeof PollingGroupEnum = PollingGroupEnum;
    public readonly throttlingGroupEnum: typeof ThrottlingGroupEnum = ThrottlingGroupEnum;

    public schedulingForm = new FormGroup({
        updatesState: new FormControl(false),
        pollingGroup: new FormGroup({
            pollingSource: new FormControl(PollingGroupEnum.TIME_DELTA, [Validators.required]),
            timeDelta: new FormControl({ value: null, disabled: true }, [Validators.required]),
            timeSegment: new FormControl({ value: "", disabled: true }, [Validators.required]),
            cronExpression: new FormControl({ value: "0 0 * * *", disabled: true }, [Validators.required]),
        }),
        throttlingGroup: new FormGroup({
            throttlingParameters: new FormControl(ThrottlingGroupEnum.AWAIT_FOR, [Validators.required]),
            awaitFor: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
            awaitUntil: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
        }),
    });

    constructor(private datasetSettingsService: DatasetSettingsService) {
        super();
    }

    public get pollingGroup(): FormGroup {
        return this.schedulingForm.get("pollingGroup") as FormGroup;
    }

    public get updateState(): AbstractControl {
        return this.schedulingForm.controls.updatesState;
    }

    public get throttlingGroup(): FormGroup {
        return this.schedulingForm.get("throttlingGroup") as FormGroup;
    }

    public ngOnInit() {
        if (!this.datasetPermissions.permissions.canSchedule) {
            this.schedulingForm.disable();
        }
        this.checkStatusSection();
        const pollingSource = this.schedulingForm.get("pollingGroup.pollingSource") as AbstractControl;
        const timeDelta = this.schedulingForm.get("pollingGroup.timeDelta") as AbstractControl;
        const timeSegment = this.schedulingForm.get("pollingGroup.timeSegment") as AbstractControl;
        const cronExpression = this.schedulingForm.get("pollingGroup.cronExpression") as AbstractControl;
        const throttlingParameters = this.schedulingForm.get("throttlingGroup.throttlingParameters") as AbstractControl;
        const awaitFor = this.schedulingForm.get("throttlingGroup.awaitFor") as AbstractControl;
        const awaitUntil = this.schedulingForm.get("throttlingGroup.awaitUntil") as AbstractControl;

        this.trackSubscriptions(
            pollingSource.valueChanges.subscribe((value: PollingGroupEnum) => {
                if (value === PollingGroupEnum.TIME_DELTA) {
                    timeDelta.enable();
                    timeSegment.enable();

                    this.disableAndClearControl(cronExpression);
                }
                if (value === PollingGroupEnum.CRON_EXPRESSION) {
                    cronExpression.enable();

                    this.disableAndClearControl(timeDelta);
                    this.disableAndClearControl(timeSegment);
                }
            }),

            throttlingParameters.valueChanges.subscribe((value: ThrottlingGroupEnum) => {
                if (value === ThrottlingGroupEnum.AWAIT_FOR) {
                    awaitFor.enable();

                    this.disableAndClearControl(awaitUntil);
                }
                if (value === ThrottlingGroupEnum.AWAIT_UNTIL) {
                    awaitUntil.enable();

                    this.disableAndClearControl(awaitFor);
                }
            }),
        );
    }

    private disableAndClearControl(control: AbstractControl): void {
        control.disable();
        control.markAsUntouched();
        control.markAsPristine();
    }

    private checkStatusSection(): void {
        if (this.datasetBasics.kind === DatasetKind.Root) {
            this.throttlingGroup.disable();
            this.pollingGroup.enable();
        } else {
            this.pollingGroup.disable();
            this.throttlingGroup.enable();
        }
    }

    public onSubmit(): void {
        const settings = this.schedulingForm.value.updatesState
            ? (this.schedulingForm.value as Partial<SchedulingSettings>)
            : { updatesState: false };

        this.datasetSettingsService.updateSchedulingSettings(settings);
    }
}
