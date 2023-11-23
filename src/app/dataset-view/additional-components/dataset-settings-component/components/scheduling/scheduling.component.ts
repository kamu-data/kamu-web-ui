import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { PollingGroupEnum, SchedulingSettings, ThrottlingGroupEnum } from "../../models/dataset-settings.model";
import { BaseComponent } from "../../../../../common/base.component";
import { DatasetSettingsService } from "../../services/dataset-settings.service";

@Component({
    selector: "app-scheduling",
    templateUrl: "./scheduling.component.html",
    styleUrls: ["./scheduling.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingComponent extends BaseComponent implements OnInit {
    // ToDo: waiting on canSchedule permission
    // @Input() public datasetPermissions: DatasetPermissionsFragment;

    public pollingGroupEnum = PollingGroupEnum;
    public throttlingGroupEnum = ThrottlingGroupEnum;

    public schedulingForm = new FormGroup({
        updatesState: new FormControl(false),
        pollingGroup: new FormGroup({
            pollingSource: new FormControl(null, [Validators.required]),
            timeDelta: new FormControl({ value: null, disabled: true }, [Validators.required]),
            timeSegment: new FormControl({ value: "", disabled: true }, [Validators.required]),
            cronExpression: new FormControl({ value: "0 0 * * *", disabled: true }, [Validators.required]),
        }),
        throttlingGroup: new FormGroup({
            throttlingParameters: new FormControl(null, [Validators.required]),
            awaitFor: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
            awaitUntil: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
        }),
    });

    constructor(private datasetSettingsService: DatasetSettingsService) {
        super();
    }

    public ngOnInit() {
        // ToDo: waiting on canSchedule permission
        // if (!this.datasetPermissions.permissions.canSchedule) {
        //     this.schedulingForm.disable();
        // }

        const pollingSource = this.schedulingForm.get("pollingGroup.pollingSource") as AbstractControl;
        const timeDelta = this.schedulingForm.get("pollingGroup.timeDelta") as AbstractControl;
        const timeSegment = this.schedulingForm.get("pollingGroup.timeSegment") as AbstractControl;
        const cronExpression = this.schedulingForm.get("pollingGroup.cronExpression") as AbstractControl;
        const throttlingParameters = this.schedulingForm.get("throttlingGroup.throttlingParameters") as AbstractControl;
        const awaitFor = this.schedulingForm.get("throttlingGroup.awaitFor") as AbstractControl;
        const awaitUntil = this.schedulingForm.get("throttlingGroup.awaitUntil") as AbstractControl;

        this.trackSubscriptions(
            pollingSource.valueChanges.subscribe((value) => {
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

            throttlingParameters.valueChanges.subscribe((value) => {
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

    public onSubmit(): void {
        const settings = this.schedulingForm.value.updatesState
            ? (this.schedulingForm.value as Partial<SchedulingSettings>)
            : { updatesState: false };

        this.datasetSettingsService.updateSchedulingSettings(settings);
    }
}
