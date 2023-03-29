/* eslint-disable @typescript-eslint/unbound-method */
import { BaseComponent } from "src/app/common/base.component";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import {
    ControlContainer,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from "@angular/forms";
import { mergeStepRadioControls } from "../../form-control.source";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { MergeStrategy } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-merge-step",
    templateUrl: "./merge-step.component.html",
    styleUrls: ["./merge-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective },
    ],
})
export class MergeStepComponent extends BaseComponent implements OnInit {
    public parentForm: FormGroup;
    public mergeStepRadioData = mergeStepRadioControls;
    public errorMessage = "";

    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
        private createDatasetService: AppDatasetCreateService,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }

    public get mergeForm(): FormGroup {
        return this.parentForm.get("merge") as FormGroup;
    }

    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.chooseMergeStep();
        this.trackSubscription(
            this.createDatasetService.onErrorCommitEventChanges.subscribe(
                (message: string) => {
                    this.errorMessage = message;
                    this.cdr.detectChanges();
                },
            ),
        );
    }

    private chooseMergeStep(): void {
        const subscription = this.mergeForm
            .get("kind")
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.mergeForm.value as MergeStrategy)
                    .filter((key: string) => key !== "kind")
                    .forEach((item: string) =>
                        this.mergeForm.removeControl(item),
                    );
                switch (kind) {
                    case "append": {
                        break;
                    }
                    case "ledger": {
                        this.initLedgerStrategy();
                        break;
                    }
                    case "snapshot": {
                        this.initSnapshotStrategy();
                        break;
                    }
                }
            });

        if (subscription) this.trackSubscription(subscription);
    }

    private initLedgerStrategy(): void {
        this.mergeForm.addControl(
            "primaryKey",
            this.fb.array([], [Validators.required]),
        );
    }

    private initSnapshotStrategy(): void {
        this.mergeForm.addControl(
            "primaryKey",
            this.fb.array([], [Validators.required]),
        );
        this.mergeForm.addControl("observationColumn", this.fb.control(""));
    }
}
