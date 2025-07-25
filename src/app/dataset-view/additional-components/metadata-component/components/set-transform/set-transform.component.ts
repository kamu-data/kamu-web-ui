/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetKind, TransformInput } from "../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import { GetDatasetSchemaQuery, SqlQueryStep } from "src/app/api/kamu.graphql.interface";
import { EditSetTransformService } from "./edit-set-transform..service";
import { parseCurrentSchema } from "src/app/common/helpers/app.helpers";
import { DatasetNode, SetTransformYamlType } from "./set-transform.types";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { from, take } from "rxjs";
import { BaseMainEventComponent } from "../source-events/base-main-event.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import AppValues from "src/app/common/values/app.values";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { StepperNavigationComponent } from "../stepper-navigation/stepper-navigation.component";
import { QueriesSectionComponent } from "./components/queries-section/queries-section.component";
import { EngineSectionComponent } from "./components/engine-section/engine-section.component";
import { SearchSectionComponent } from "./components/search-section/search-section.component";
import { RouterLink } from "@angular/router";
import { NgIf } from "@angular/common";
import { EditorModule } from "src/app/editor/editor.module";

@Component({
    selector: "app-set-transform",
    templateUrl: "./set-transform.component.html",
    styleUrls: ["./set-transform.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgIf,
        RouterLink,

        //-----//
        EditorModule,
        EngineSectionComponent,
        QueriesSectionComponent,
        SearchSectionComponent,
        StepperNavigationComponent,
    ],
})
export class SetTransformComponent extends BaseMainEventComponent implements OnInit {
    @Input(RoutingResolvers.SET_TRANSFORM_KEY) public eventYamlByHash: string;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    public inputDatasets = new Set<string>();
    public selectedEngine: string;
    public currentSetTransformEvent: MaybeNull<SetTransformYamlType>;
    public queries: Omit<SqlQueryStep, "__typename">[] = [];
    public dataSource = new MatTreeNestedDataSource<DatasetNode>();
    public TREE_DATA: DatasetNode[] = [];
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    private readonly UNAVAILABLE_INPUT_LABEL: string = AppValues.SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL;

    private editService = inject(EditSetTransformService);

    public ngOnInit(): void {
        this.checkDatasetEditability(DatasetKind.Derivative);
        this.initQueriesSection();
        this.subscribeErrorMessage();
    }

    public onSelectEngine(engine: string): void {
        this.selectedEngine = engine;
    }

    public get isInputDatasetsExist(): boolean {
        return !!this.inputDatasets.size;
    }

    private initQueriesSection(): void {
        if (this.eventYamlByHash) {
            this.currentSetTransformEvent = this.editService.parseEventFromYaml(this.eventYamlByHash);

            if (this.currentSetTransformEvent.transform.query) {
                this.initDefaultQueriesSection(this.currentSetTransformEvent.transform.query);
            } else {
                this.queries = this.currentSetTransformEvent.transform.queries;
            }
            this.getInputDatasetsInfo();
        } else {
            this.initDefaultQueriesSection();
        }
        this.history = this.editService.history;
    }

    private initDefaultQueriesSection(query = ""): void {
        this.queries = [...this.queries, { query }];
    }

    private getInputDatasetsInfo(): void {
        this.currentSetTransformEvent?.inputs.forEach((item: TransformInput) => {
            /* istanbul ignore else */
            if (item.datasetRef) {
                this.inputDatasets.add(JSON.stringify(item));

                this.datasetService
                    .requestDatasetSchema(item.datasetRef)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((data: GetDatasetSchemaQuery) => {
                        if (data.datasets.byId) {
                            const schema: MaybeNull<DatasetSchema> = parseCurrentSchema(
                                data.datasets.byId.metadata.currentSchema,
                            );

                            const datasetInfo = item.alias.split("/");
                            this.TREE_DATA.push({
                                name: datasetInfo.length > 1 ? datasetInfo[1] : item.alias,
                                children: schema?.fields,
                                owner: datasetInfo.length > 1 ? datasetInfo[0] : AppValues.DEFAULT_ADMIN_ACCOUNT_NAME,
                            });
                        } else {
                            this.TREE_DATA.push({
                                name: this.UNAVAILABLE_INPUT_LABEL,
                                children: [],
                                owner: "",
                            });
                        }
                        this.dataSource.data = this.TREE_DATA;
                    });
            } else {
                throw new Error("TransformInput without an 'datasetRef' is unexpected");
            }
        });
    }

    public onEditYaml(): void {
        const modalRef: NgbModalRef = this.modalService.open(FinalYamlModalComponent, { size: "lg" });
        const instance = modalRef.componentInstance as FinalYamlModalComponent;
        instance.yamlTemplate =
            this.errorMessage && this.changedEventYamlByHash
                ? this.changedEventYamlByHash
                : this.yamlEventService.buildYamlSetTransformEvent(
                      this.editService.transformEventAsObject(this.inputDatasets, this.selectedEngine, this.queries),
                  );
        instance.datasetInfo = this.getDatasetInfoFromUrl();
        instance.enabledSaveBtn = this.isInputDatasetsExist;

        from(modalRef.result)
            .pipe(take(1))
            .subscribe((eventYaml: string) => {
                this.changedEventYamlByHash = eventYaml;
            });
    }

    public onSaveEvent(): void {
        this.datasetCommitService
            .commitEventToDataset({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                accountName: this.getDatasetInfoFromUrl().accountName,
                datasetName: this.getDatasetInfoFromUrl().datasetName,
                event: this.yamlEventService.buildYamlSetTransformEvent(
                    this.editService.transformEventAsObject(this.inputDatasets, this.selectedEngine, this.queries),
                ),
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
