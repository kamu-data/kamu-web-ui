import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DatasetBasicsFragment, ViewDatasetEnvVar } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { noWhitespaceValidator } from "src/app/common/data.helpers";
import { EvnironmentVariablesService } from "src/app/services/evnironment-variables.service";

@Component({
    selector: "app-edit-key-value-modal",
    templateUrl: "./edit-key-value-modal.component.html",
    styleUrls: ["./edit-key-value-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditKeyValueModalComponent extends BaseComponent implements OnInit {
    @Input() public row: MaybeNull<ViewDatasetEnvVar>;
    @Input() public datasetBasics: DatasetBasicsFragment;
    public readonly KEY_MAX_LENGTH = 200;
    public keyValueForm: FormGroup = this.fb.group({
        key: ["", [Validators.required, Validators.maxLength(this.KEY_MAX_LENGTH), noWhitespaceValidator]],
        value: ["", [Validators.required]],
        isSecret: [false],
    });

    public exposedValue: string;
    public isShowExposedValue: boolean = false;
    public readonly STUB_VALUE = "stub-value";

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private evnironmentVariablesService: EvnironmentVariablesService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.fetchExposedValue();
        this.setInitialFormValue();
    }

    public get keyControl(): AbstractControl {
        return this.keyValueForm.controls.key;
    }

    public get valueControl(): AbstractControl {
        return this.keyValueForm.controls.value;
    }

    public onEditRow(): void {
        if (!this.row) {
            this.trackSubscription(
                this.evnironmentVariablesService
                    .saveEnvVariable({
                        accountId: this.datasetBasics.owner.id,
                        datasetId: this.datasetBasics.id,
                        key: this.keyValueForm.controls.key.value as string,
                        value: this.exposedValue
                            ? this.exposedValue
                            : (this.keyValueForm.controls.value.value as string),
                        isSecret: this.keyValueForm.controls.isSecret.value ? true : false,
                    })
                    .subscribe(() => {
                        this.activeModal.close("Success");
                    }),
            );
        } else {
            this.trackSubscription(
                this.evnironmentVariablesService
                    .modifyEnvVariable({
                        accountId: this.datasetBasics.owner.id,
                        datasetId: this.datasetBasics.id,
                        id: this.row.id,
                        newValue: this.keyValueForm.controls.value.value as string,
                        isSecret: this.keyValueForm.controls.isSecret.value ? true : false,
                    })
                    .subscribe(() => {
                        this.activeModal.close("Success");
                    }),
            );
        }
    }

    public toggleExposedValue(): void {
        this.isShowExposedValue = !this.isShowExposedValue;
        this.keyValueForm.patchValue({
            value: this.isShowExposedValue ? this.exposedValue : (this.valueControl.value as string),
        });
    }

    private fetchExposedValue(): void {
        if (this.row?.isSecret) {
            this.trackSubscription(
                this.evnironmentVariablesService
                    .exposedEnvVariableValue({
                        accountName: this.datasetBasics.owner.accountName,
                        datasetName: this.datasetBasics.name,
                        datasetEnvVarId: this.row?.id,
                    })
                    .subscribe((data) => {
                        this.exposedValue = data;
                        this.keyValueForm.patchValue({
                            value: this.exposedValue,
                        });
                    }),
            );
        }
    }

    private setInitialFormValue(): void {
        if (this.row) {
            this.keyValueForm.patchValue({
                key: this.row.key,
                value: this.row.isSecret ? this.exposedValue : this.row.value,
                isSecret: this.row.isSecret,
            });
        }
    }
}
