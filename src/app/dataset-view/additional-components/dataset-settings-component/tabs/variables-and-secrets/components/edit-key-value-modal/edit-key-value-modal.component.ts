import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DatasetBasicsFragment, ViewDatasetEnvVar } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
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
    public keyValueForm: FormGroup = this.fb.group({
        key: ["", [Validators.required]],
        value: ["", [Validators.required]],
        isSecret: [false],
    });

    public exposedValue: string;
    public readonly STUB_VALUE = "stub-value";

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private evnironmentVariablesService: EvnironmentVariablesService,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }

    ngOnInit(): void {
        this.setInitialFormValue();
    }

    public onEditRow(): void {
        if (!this.row) {
            this.trackSubscription(
                this.evnironmentVariablesService
                    .saveEnvVariable({
                        accountId: this.datasetBasics.owner.id,
                        datasetId: this.datasetBasics.id,
                        key: this.keyValueForm.controls.key.value as string,
                        value: this.keyValueForm.controls.value.value as string,
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

    public showExposedValue(): void {
        this.trackSubscription(
            this.evnironmentVariablesService
                .exposedEnvVariableValue({
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                    datasetEnvVarId: this.row?.id as string,
                })
                .subscribe((data) => {
                    this.keyValueForm.patchValue({
                        value: data,
                    });
                    this.exposedValue = data;
                    this.cdr.detectChanges();
                }),
        );
    }

    public hideExposedValue(): void {
        this.keyValueForm.patchValue({
            value: this.STUB_VALUE,
        });
        this.exposedValue = "";
    }

    private setInitialFormValue(): void {
        if (this.row) {
            this.keyValueForm.patchValue({
                key: this.row.key,
                value: this.row.isSecret ? this.STUB_VALUE : this.row.value,
                isSecret: this.row.isSecret,
            });
        }
    }
}
