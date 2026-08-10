/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

import { finalize, Observable, tap } from "rxjs";

import { NgSelectModule } from "@ng-select/ng-select";

import { BaseComponent } from "@common/components/base.component";
import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import AppValues from "@common/values/app.values";
import { AccountProvider, DatasetBasicsFragment, DatasetKind, DatasetVisibility } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { DatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import {
    ARCHETYPE_LIST,
    ArchetypeViewType,
    CreateDatasetFormType,
    SelectArchetypeType,
    SelectStorageItemType,
    STORAGE_LIST,
} from "src/app/dataset-create/dataset-create.types";
import { YamlEditorComponent } from "src/app/editor/components/yaml-editor/yaml-editor.component";
import { EditorModule } from "src/app/editor/editor.module";

import { DatasetViewTypeEnum } from "../dataset-view/dataset-view.interface";
import { NavigationService } from "../services/navigation.service";

@Component({
    selector: "app-dataset-create",
    templateUrl: "./dataset-create.component.html",
    styleUrls: ["./dataset-create.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        NgFor,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
        NgSelectModule,
        //-----//
        FormValidationErrorsDirective,
        YamlEditorComponent,
        EditorModule,
    ],
})
export class DatasetCreateComponent extends BaseComponent {
    private cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private datasetCreateService = inject(DatasetCreateService);
    private loggedUserService = inject(LoggedUserService);
    private loginMethodsService = inject(LoginMethodsService);
    private navigationService = inject(NavigationService);

    public readonly DatasetVisibility: typeof DatasetVisibility = DatasetVisibility;
    public readonly DatasetKind: typeof DatasetKind = DatasetKind;
    private static readonly INITIAL_YAML_HINT = "# You can edit this file\n";

    public yamlTemplate = "";
    public showMonacoEditor = false;
    public errorMessage$: Observable<string>;
    public owners: string[] = [];
    public archetype: ArchetypeViewType = ArchetypeViewType.DATASET_WITH_DATA;
    public createDatasetForm: FormGroup<CreateDatasetFormType> = this.fb.nonNullable.group({
        owner: ["", [Validators.required]],
        datasetName: ["", [Validators.required, Validators.pattern(AppValues.DATASET_NAME_PATTERN)]],
        kind: [DatasetKind.Root, [Validators.required]],
        visibility: [DatasetVisibility.Private],
    });
    public readonly DROPDOWN_LIST: SelectStorageItemType[] = STORAGE_LIST;
    public readonly ARCHETYPE_LIST: SelectArchetypeType[] = ARCHETYPE_LIST;
    public readonly ArchetypeViewType: typeof ArchetypeViewType = ArchetypeViewType;
    public readonly ARCHETYPE_TOOLTIP: string =
        "Archetypes are common schema blueprints optimized for specific types of tasks. While data is still stored as a changelog ledger under the hood, archetypes provide convenient ways to visualize and edit the data.";

    // default id item from STORAGE_LIST
    public selectedStorage: number = 1;

    public ngOnInit(): void {
        const currentUser = this.loggedUserService.maybeCurrentlyLoggedInUser;
        if (currentUser) {
            this.owners = [currentUser.accountName];
            this.createDatasetForm.controls.owner.setValue(currentUser.accountName);
        }
        this.errorMessage$ = this.datasetCreateService.errorMessageChanges;
    }

    public get datasetName() {
        return this.createDatasetForm.get("datasetName");
    }

    public get owner() {
        return this.createDatasetForm.get("owner");
    }

    public get visibilityControl(): FormControl<DatasetVisibility> {
        return this.createDatasetForm.controls.visibility;
    }

    public get isFormValid(): boolean {
        if (this.yamlTemplate) return true;
        return this.createDatasetForm.valid;
    }

    public onCreateDataset(): void {
        if (this.showMonacoEditor) {
            this.createDatasetFromSnapshot();
        } else {
            this.createDatasetFromForm();
        }
    }

    public onFileSelected(event: Event): Promise<MaybeNull<string>> {
        return new Promise<string>((resolve) => {
            const input = event.target as HTMLInputElement;
            if (!input.files?.length) {
                resolve("");
            } else {
                const file = input.files[0];
                const fileReader: FileReader = new FileReader();
                fileReader.onload = () => {
                    this.yamlTemplate += DatasetCreateComponent.INITIAL_YAML_HINT;
                    this.yamlTemplate += fileReader.result as string;
                    resolve(this.yamlTemplate);
                    this.cdr.detectChanges();
                };
                fileReader.readAsText(file);
                this.yamlTemplate = "";
            }
        });
    }

    public onShowMonacoEditor(): void {
        this.setAvailabilityControls();
    }

    public onChangeArchetype(event: SelectArchetypeType): void {
        this.createDatasetForm.controls.datasetName.enable();
        this.createDatasetForm.controls.owner.enable();
        if (event.value === ArchetypeViewType.DATASET_WITH_DATA) {
            this.createDatasetForm.controls.kind.enable();
        } else {
            this.createDatasetForm.patchValue({ kind: DatasetKind.Root });
            this.createDatasetForm.controls.kind.disable();

            this.yamlTemplate = "";
            this.showMonacoEditor = false;
        }
    }

    private createDatasetFromForm(): void {
        const datasetAlias = this.createDatasetForm.controls.datasetName.value;
        const datasetVisibility = this.visibilityControl.value;
        const datasetKind = this.createDatasetForm.controls.kind.value;

        const creationStrategies: Record<ArchetypeViewType, () => Observable<void | DatasetBasicsFragment>> = {
            [ArchetypeViewType.DATASET_WITH_DATA]: () =>
                this.datasetCreateService.createEmptyDataset({
                    datasetKind,
                    datasetAlias,
                    datasetVisibility,
                }),
            [ArchetypeViewType.COLLECTION]: () =>
                this.datasetCreateService.createCollection({
                    datasetAlias,
                    datasetVisibility,
                }),
            [ArchetypeViewType.VERSIONED_FILE]: () =>
                this.datasetCreateService
                    .createVersionedFile({
                        datasetAlias,
                        datasetVisibility,
                    })
                    .pipe(
                        tap(() => {
                            this.navigationService.navigateToDatasetView({
                                accountName: this.loggedUserService.currentlyLoggedInUser.accountName,
                                datasetName: datasetAlias,
                                tab: DatasetViewTypeEnum.Overview,
                            });
                        }),
                    ),
        };

        creationStrategies[this.archetype]().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }

    private createDatasetFromSnapshot(): void {
        if (this.yamlTemplate) {
            this.datasetCreateService
                .createDatasetFromSnapshot({
                    snapshot: this.yamlTemplate,
                    datasetVisibility: this.visibilityControl.value,
                })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        }
    }

    private setAvailabilityControls(): void {
        this.createDatasetForm.controls.datasetName.setValue("");
        if (this.showMonacoEditor) {
            this.createDatasetForm.controls.datasetName.disable();
            this.createDatasetForm.controls.owner.disable();
            this.createDatasetForm.controls.kind.disable();
        } else {
            this.createDatasetForm.controls.datasetName.enable();
            this.createDatasetForm.controls.owner.enable();
            this.createDatasetForm.controls.kind.enable();
            this.yamlTemplate = "";
            this.datasetCreateService.emitErrorMessageChanged("");
        }
    }

    public get isAccountProviderMultiMode(): boolean {
        return this.loginMethodsService.loginMethods.includes(AccountProvider.OauthGithub);
    }
}
