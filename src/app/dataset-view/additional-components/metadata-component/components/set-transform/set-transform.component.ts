/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";

import { catchError, filter, from, of, take } from "rxjs";

import { openModal } from "@common/helpers/modal.helpers";
import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { FinalYamlModalComponent } from "src/app/dataset-view/additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.component";
import { EngineSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine-section.component";
import { QueriesSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/queries-section/queries-section.component";
import { SearchSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/search-section/search-section.component";
import { EditSetTransformService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/edit-set-transform..service";
import { transformInputsFormArray } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.helpers";
import {
    SetTransformYamlType,
    TransformInputsFormArray,
    TransformQueryStep,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";
import { BaseMainEventComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/base-main-event.component";
import { StepperNavigationComponent } from "src/app/dataset-view/additional-components/metadata-component/components/stepper-navigation/stepper-navigation.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-set-transform",
    templateUrl: "./set-transform.component.html",
    styleUrls: ["./set-transform.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        RouterLink,
        //-----//
        EngineSectionComponent,
        QueriesSectionComponent,
        SearchSectionComponent,
        StepperNavigationComponent,
        DatasetLinkPipe,
    ],
})
export class SetTransformComponent extends BaseMainEventComponent implements OnInit {
    @Input(RoutingResolvers.SET_TRANSFORM_KEY) public eventYamlByHash: string;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public inputsForm: TransformInputsFormArray = transformInputsFormArray([]);
    public selectedEngine: string;
    public currentSetTransformEvent: MaybeNull<SetTransformYamlType>;
    public queries: TransformQueryStep[] = [];
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    private editService = inject(EditSetTransformService);

    public ngOnInit(): void {
        this.initQueriesSection();
        this.subscribeErrorMessage();
    }

    public onSelectEngine(engine: string): void {
        this.selectedEngine = engine;
    }

    public get isInputsValid(): boolean {
        return this.inputsForm.length > 0 && this.inputsForm.valid;
    }

    private initQueriesSection(): void {
        if (this.eventYamlByHash) {
            this.currentSetTransformEvent = this.editService.parseEventFromYaml(this.eventYamlByHash);
            this.selectedEngine = this.currentSetTransformEvent.transform.engine;

            if (this.currentSetTransformEvent.transform.query) {
                this.initDefaultQueriesSection(this.currentSetTransformEvent.transform.query);
            } else {
                this.queries = this.currentSetTransformEvent.transform.queries ?? [];
            }
            this.inputsForm = transformInputsFormArray(
                this.currentSetTransformEvent.inputs.filter((item) => !!item.datasetRef),
            );
        } else {
            this.initDefaultQueriesSection();
        }
    }

    private initDefaultQueriesSection(query = ""): void {
        this.queries = [...this.queries, { query }];
    }

    public onEditYaml(): void {
        const { modalRef, instance } = openModal(this.modalService, FinalYamlModalComponent, { size: "lg" });
        instance.yamlTemplate =
            this.errorMessage && this.changedEventYamlByHash
                ? this.changedEventYamlByHash
                : this.yamlEventService.buildYamlSetTransformEvent(
                      this.editService.transformEventAsObject(
                          this.inputsForm.getRawValue(),
                          this.selectedEngine,
                          this.queries,
                      ),
                  );
        instance.datasetInfo = this.getDatasetInfoFromUrl();
        instance.enabledSaveBtn = this.isInputsValid;

        from(modalRef.result)
            .pipe(
                take(1),
                catchError(() => of(null)),
            )
            .subscribe((eventYaml: unknown) => {
                this.changedEventYamlByHash = typeof eventYaml === "string" ? eventYaml : null;
            });
    }

    public onSaveEvent(): void {
        this.datasetCommitService
            .commitEventToDataset({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                accountName: this.getDatasetInfoFromUrl().accountName,
                datasetName: this.getDatasetInfoFromUrl().datasetName,
                event: this.yamlEventService.buildYamlSetTransformEvent(
                    this.editService.transformEventAsObject(
                        this.inputsForm.getRawValue(),
                        this.selectedEngine,
                        this.queries,
                    ),
                ),
            })
            .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.navigationServices.navigateToDatasetView({
                    accountName: this.getDatasetInfoFromUrl().accountName,
                    datasetName: this.getDatasetInfoFromUrl().datasetName,
                    tab: DatasetViewTypeEnum.Overview,
                });
            });
    }
}
