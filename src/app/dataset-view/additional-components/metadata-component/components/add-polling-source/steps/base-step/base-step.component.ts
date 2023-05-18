import { BaseComponent } from "src/app/common/base.component";
import {
    ControlType,
    EventTimeSourceKind,
    JsonFormData,
} from "../../add-polling-source-form.types";
import { RadioControlType } from "../../form-control.source";
import { FormArray, FormBuilder } from "@angular/forms";
import { ControlContainer, FormGroupDirective } from "@angular/forms";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { JsonFormControls } from "../../add-polling-source-form.types";
import { DataHelpers, getValidators } from "src/app/common/data.helpers";
import { DatasetMetadataSummaryFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { AppDatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { MetadataSchemaUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";

@Component({
    selector: "app-base-step",
    templateUrl: "./base-step.component.html",
    styleUrls: ["./base-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective },
    ],
})
export class BaseStepComponent extends BaseComponent implements OnInit {
    public parentForm: FormGroup;
    @Input() public sectionStepRadioData: RadioControlType[];
    @Input() public sectionFormData: JsonFormData;
    @Input() public defaultKind: string;
    @Input() public groupName: SetPollingSourceSection;
    @Input() public title: string;
    @Input() public eventMetadata: MaybeNull<DatasetMetadataSummaryFragment>;
    public controlType: typeof ControlType = ControlType;
    public readonly KIND_NAME_CONTROL = "kind";
    public readonly SCHEMA_NAME_CONTROL = "schema";
    private readonly DEFAULT_EVENT_TIME_SOURCE =
        EventTimeSourceKind.FROM_METADATA;

    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private appDatasetSubsService: AppDatasetSubscriptionsService,
    ) {
        super();
    }

    public get sectionForm(): FormGroup {
        return this.parentForm.get(this.groupName) as FormGroup;
    }

    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        if (this.eventMetadata?.metadata.currentSource)
            console.log(
                "===>",
                this.eventMetadata.metadata.currentSource.fetch,
            );
        this.initForm(
            this.sectionForm.get(this.KIND_NAME_CONTROL)?.value as string,
        );
        this.chooseFetchKind();
        this.setFetchStepForm();
        // this.trackSubscription(
        //     this.appDatasetSubsService.onMetadataSchemaChanges.subscribe(
        //         (schemaUpdate: MetadataSchemaUpdate) => {
        //             console.log(
        //                 "baseStep==>",
        //                 schemaUpdate.metadata.metadata.currentSource,
        //             );
        //             this.eventMetadata = schemaUpdate.metadata;
        //             this.setFetchStepForm();
        //         },
        //     ),
        // );
    }

    private setFetchStepForm(): void {
        if (
            this.eventMetadata?.metadata.currentSource &&
            this.groupName === SetPollingSourceSection.FETCH
        ) {
            console.log("baseStep work");
            this.sectionForm.patchValue({
                kind: DataHelpers.toLowercase(
                    DataHelpers.descriptionSetPollingSourceSteps(
                        this.eventMetadata.metadata.currentSource[
                            this.groupName
                        ].__typename as string,
                    ).replace(/\s/g, ""),
                ),
                ...this.eventMetadata.metadata.currentSource.fetch,
            });
            switch (
                this.eventMetadata.metadata.currentSource.fetch.__typename
            ) {
                case "FetchStepContainer": {
                    const env = this.sectionForm.controls.env as FormArray;
                    this.eventMetadata.metadata.currentSource.fetch.env?.forEach(
                        (item) => {
                            env.push(
                                this.fb.group({
                                    name: [item.name],
                                    value: [item.value],
                                }),
                            );
                        },
                    );
                    const command = this.sectionForm.controls
                        .command as FormArray;
                    this.eventMetadata.metadata.currentSource.fetch.command?.forEach(
                        (item) => {
                            command.push(
                                this.fb.control(
                                    item,
                                    RxwebValidators.required(),
                                ),
                            );
                        },
                    );
                    const args = this.sectionForm.controls.args as FormArray;
                    this.eventMetadata.metadata.currentSource.fetch.args?.forEach(
                        (item) => {
                            args.push(
                                this.fb.control(
                                    item,
                                    RxwebValidators.required(),
                                ),
                            );
                        },
                    );
                    break;
                }
                case "FetchStepUrl": {
                    const headers = this.sectionForm.controls
                        .headers as FormArray;
                    this.eventMetadata.metadata.currentSource.fetch.headers?.forEach(
                        (item) => {
                            headers.push(
                                this.fb.group({
                                    name: [item.name],
                                    value: [item.value],
                                }),
                            );
                        },
                    );
                    const eventTimeGroup = this.sectionForm.controls
                        .eventTime as FormGroup;
                    if (
                        this.eventMetadata.metadata.currentSource.fetch
                            .eventTime?.__typename === "EventTimeSourceFromPath"
                    ) {
                        eventTimeGroup.addControl(
                            "pattern",
                            this.fb.control(
                                this.eventMetadata.metadata.currentSource.fetch
                                    .eventTime.pattern,
                                RxwebValidators.required(),
                            ),
                        );
                        eventTimeGroup.addControl(
                            "timestampFormat",
                            this.fb.control(
                                this.eventMetadata.metadata.currentSource.fetch
                                    .eventTime.timestampFormat,
                            ),
                        );
                    }
                    break;
                }
                case "FetchStepFilesGlob": {
                    const eventTimeGroup = this.sectionForm.controls
                        .eventTime as FormGroup;
                    if (
                        this.eventMetadata.metadata.currentSource.fetch
                            .eventTime?.__typename === "EventTimeSourceFromPath"
                    ) {
                        eventTimeGroup.addControl(
                            "pattern",
                            this.fb.control(
                                this.eventMetadata.metadata.currentSource.fetch
                                    .eventTime.pattern,
                                RxwebValidators.required(),
                            ),
                        );
                        eventTimeGroup.addControl(
                            "timestampFormat",
                            this.fb.control(
                                this.eventMetadata.metadata.currentSource.fetch
                                    .eventTime.timestampFormat,
                            ),
                        );
                    }
                    break;
                }
            }

            console.log("form-value", this.sectionForm.value);
        }
    }

    private chooseFetchKind(): void {
        const subscription = this.sectionForm
            .get(this.KIND_NAME_CONTROL)
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.sectionForm.value as object)
                    .filter(
                        (key: string) =>
                            ![
                                this.KIND_NAME_CONTROL,
                                this.SCHEMA_NAME_CONTROL,
                            ].includes(key),
                    )
                    .forEach((item: string) => {
                        this.sectionForm.removeControl(item);
                    });
                this.initForm(kind);
            });
        if (subscription) this.trackSubscription(subscription);
    }

    private isArrayControl(type: ControlType): boolean {
        return [
            this.controlType.ARRAY_KEY_VALUE,
            this.controlType.ARRAY_KEY,
            this.controlType.SCHEMA,
        ].includes(type);
    }

    private getEventTimeType(): string {
        if (
            this.eventMetadata?.metadata.currentSource?.fetch.__typename ===
                "FetchStepUrl" ||
            (this.eventMetadata?.metadata.currentSource?.fetch.__typename ===
                "FetchStepFilesGlob" &&
                this.eventMetadata.metadata.currentSource.fetch.eventTime
                    ?.__typename === "EventTimeSourceFromPath")
        ) {
            return EventTimeSourceKind.FROM_PATH;
        }
        return this.DEFAULT_EVENT_TIME_SOURCE;
    }

    private initForm(kind: string): void {
        this.sectionFormData[kind].controls.forEach(
            (item: JsonFormControls) => {
                if (this.isArrayControl(item.type)) {
                    this.sectionForm.addControl(item.name, this.fb.array([]));
                } else if (item.type === this.controlType.EVENT_TIME) {
                    this.sectionForm.addControl(
                        item.name,
                        this.fb.group({
                            // kind: [this.getEventTimeType()],
                            kind: [this.DEFAULT_EVENT_TIME_SOURCE],
                        }),
                    );
                } else {
                    this.sectionForm.addControl(
                        item.name,
                        this.fb.control(
                            item.value,
                            getValidators(item.validators),
                        ),
                    );
                }
            },
        );
    }
}
