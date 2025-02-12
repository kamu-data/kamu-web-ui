import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DatasetBasicsFragment, ViewDatasetEnvVar } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";
import { BaseComponent } from "src/app/common/components/base.component";
import { noWhitespaceValidator } from "src/app/common/helpers/data.helpers";
import { DatasetEvnironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-evnironment-variables.service";
import { EnvAndSecretsFormType } from "./edit-key-value-modal.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-edit-key-value-modal",
    templateUrl: "./edit-key-value-modal.component.html",
    styleUrls: ["./edit-key-value-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditKeyValueModalComponent extends BaseComponent implements OnInit {
    public activeModal = inject(NgbActiveModal);
    private fb = inject(FormBuilder);
    private evnironmentVariablesService = inject(DatasetEvnironmentVariablesService);

    @Input({ required: true }) public row: MaybeNull<ViewDatasetEnvVar>;
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    public readonly KEY_MAX_LENGTH = 200;
    public readonly IS_SECRET_CONTROL_TOOLTIP =
        "While both secrets and variables are stored encrypted, making value a secret ensures that is used without ever being exposed by the system in task logs and other places. Use secrets for sensitive information like API keys and auth tokens.";
    public keyValueForm: FormGroup<EnvAndSecretsFormType> = this.fb.nonNullable.group({
        keyEnvVariable: ["", [Validators.required, Validators.maxLength(this.KEY_MAX_LENGTH), noWhitespaceValidator()]],
        value: ["", [Validators.required]],
        isSecret: [false],
    });

    public exposedValue: string;
    public isShowExposedValue: boolean = false;
    public readonly STUB_VALUE = "stub-value";

    public ngOnInit(): void {
        this.fetchExposedValue();
        this.setInitialFormValue();
    }

    public get keyControl(): AbstractControl<string> {
        return this.keyValueForm.controls.keyEnvVariable;
    }

    public get valueControl(): AbstractControl<string> {
        return this.keyValueForm.controls.value;
    }

    public get isSecretControl(): AbstractControl<boolean> {
        return this.keyValueForm.controls.isSecret;
    }

    public onEditRow(): void {
        this.evnironmentVariablesService
            .upsertEnvVariable({
                accountId: this.datasetBasics.owner.id,
                datasetId: this.datasetBasics.id,
                key: this.keyControl.value ?? "",
                value: this.keyValueForm.controls.value.value ?? "",
                isSecret: this.keyValueForm.controls.isSecret.value ? true : false,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.activeModal.close("Success");
            });
    }

    public toggleExposedValue(): void {
        this.isShowExposedValue = !this.isShowExposedValue;
        if (!this.isShowExposedValue) {
            this.exposedValue = "";
        } else {
            this.fetchExposedValue();
            this.keyValueForm.patchValue({
                value: this.isShowExposedValue ? this.exposedValue : this.valueControl.value,
            });
        }
    }

    private fetchExposedValue(): void {
        if (this.row?.isSecret) {
            this.evnironmentVariablesService
                .exposedEnvVariableValue({
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                    datasetEnvVarId: this.row?.id,
                })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data) => {
                    this.exposedValue = data;
                    this.keyValueForm.patchValue({
                        value: this.exposedValue,
                    });
                });
        }
    }

    private setInitialFormValue(): void {
        if (this.row) {
            this.keyValueForm.patchValue({
                keyEnvVariable: this.row.key,
                value: this.row.isSecret ? this.exposedValue : (this.row.value ?? ""),
                isSecret: this.row.isSecret,
            });
            this.row.isSecret ? this.isSecretControl.disable() : this.isSecretControl.enable();
        }
    }
}
