import {
    DatasetBasicsFragment,
    DatasetKind,
    TransformInput,
} from "./../../../../../api/kamu.graphql.interface";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { BaseComponent } from "src/app/common/base.component";
import { MaybeNull } from "src/app/common/app.types";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import {
    GetDatasetSchemaQuery,
    SqlQueryStep,
} from "src/app/api/kamu.graphql.interface";
import { EditSetTransformService } from "./edit-set-transform..service";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { parseCurrentSchema, requireValue } from "src/app/common/app.helpers";
import ProjectLinks from "src/app/project-links";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetNode, SetTransFormYamlType } from "./set-transform.types";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
@Component({
    selector: "app-set-transform",
    templateUrl: "./set-transform.component.html",
    styleUrls: ["./set-transform.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformComponent extends BaseComponent implements OnInit {
    public inputDatasets = new Set<string>();
    public selectedEngine: string;
    public eventYamlByHash: MaybeNull<string>;
    public history: DatasetHistoryUpdate;
    public currentSetTransformEvent: MaybeNull<SetTransFormYamlType>;
    public queries: Omit<SqlQueryStep, "__typename">[] = [];
    public dataSource = new MatTreeNestedDataSource<DatasetNode>();
    public TREE_DATA: DatasetNode[] = [];
    public datasetKind: DatasetKind;

    constructor(
        private datasetService: DatasetService,
        private cdr: ChangeDetectorRef,
        private editService: EditSetTransformService,
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private yamlEventService: TemplatesYamlEventsService,
        private createDatasetService: AppDatasetCreateService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getDatasetKind();
        this.initQueriesSection();
    }

    public onSelectEngine(engine: string): void {
        this.selectedEngine = engine;
    }

    public get isInputDatasetsExist(): boolean {
        return !!this.inputDatasets.size;
    }

    // private owners(): string[] {
    //     return this.TREE_DATA.map((item) => item.owner) as string[];
    // }

    private getDatasetKind(): void {
        this.trackSubscription(
            this.editService.onKindChanges.subscribe((kind: DatasetKind) => {
                this.datasetKind = kind;
            }),
        );
    }

    private initQueriesSection(): void {
        this.trackSubscription(
            this.editService
                .getEventAsYaml(
                    this.getDatasetInfoFromUrl(),
                    SupportedEvents.SetTransform,
                )

                .subscribe((result: string | null | undefined) => {
                    if (result) {
                        this.eventYamlByHash = result;
                        this.currentSetTransformEvent =
                            this.editService.parseEventFromYaml(
                                this.eventYamlByHash,
                            );
                        if (this.currentSetTransformEvent.transform.query) {
                            this.initDefaultQueriesSection(
                                this.currentSetTransformEvent.transform.query,
                            );
                        } else {
                            this.queries =
                                this.currentSetTransformEvent.transform.queries;
                        }
                        this.getInputDatasetsInfo();
                    } else {
                        this.initDefaultQueriesSection();
                    }
                    this.history = this.editService.history;
                    this.cdr.detectChanges();
                }),
        );
    }

    private initDefaultQueriesSection(query = ""): void {
        this.queries = [
            ...this.queries,
            { alias: this.getDatasetInfoFromUrl().datasetName, query },
        ];
    }

    private getInputDatasetsInfo(): void {
        this.currentSetTransformEvent?.inputs.forEach(
            (item: TransformInput) => {
                this.inputDatasets.add(JSON.stringify(item));
                this.trackSubscription(
                    this.datasetService
                        .requestDatasetSchema(item.id as string)
                        .subscribe((data: GetDatasetSchemaQuery) => {
                            if (data.datasets.byId) {
                                const owner = (
                                    data.datasets.byId as DatasetBasicsFragment
                                ).owner.name;
                                const schema: MaybeNull<DatasetSchema> =
                                    parseCurrentSchema(data);
                                this.TREE_DATA.push({
                                    name: item.name as string,
                                    children: schema?.fields,
                                    owner,
                                });
                                this.dataSource.data = this.TREE_DATA;
                            }
                        }),
                );
            },
        );
    }

    public getDatasetInfoFromUrl(): DatasetInfo {
        const paramMap: ParamMap = this.activatedRoute.snapshot.paramMap;
        return {
            accountName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
            ),
            datasetName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
            ),
        };
    }

    public onEditYaml(): void {
        const modalRef: NgbModalRef = this.modalService.open(
            FinalYamlModalComponent,
            { size: "lg" },
        );
        const instance = modalRef.componentInstance as FinalYamlModalComponent;
        instance.yamlTemplate =
            this.yamlEventService.buildYamlSetTransformEvent(
                this.editService.transformEventAsObject(
                    this.inputDatasets,
                    this.selectedEngine,
                    this.queries,
                    //  this.owners(),
                ),
            );
        instance.datasetInfo = this.getDatasetInfoFromUrl();
        instance.enabledSaveBtn = this.isInputDatasetsExist;
    }

    public onSaveEvent(): void {
        this.trackSubscription(
            this.createDatasetService
                .commitEventToDataset(
                    this.getDatasetInfoFromUrl().accountName,
                    this.getDatasetInfoFromUrl().datasetName,
                    this.yamlEventService.buildYamlSetTransformEvent(
                        this.editService.transformEventAsObject(
                            this.inputDatasets,
                            this.selectedEngine,
                            this.queries,
                            //   this.owners(),
                        ),
                    ),
                )
                .subscribe(),
        );
    }
}
