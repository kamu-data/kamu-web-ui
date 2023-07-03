import { TransformInput } from "./../../../../../api/kamu.graphql.interface";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import {
    NgbModal,
    NgbModalRef,
    NgbTypeaheadSelectItemEvent,
} from "@ng-bootstrap/ng-bootstrap";
import { OperatorFunction, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { SearchApi } from "src/app/api/search.api";
import AppValues from "src/app/common/app.values";
import { DatasetAutocompleteItem } from "src/app/interface/search.interface";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { BaseComponent } from "src/app/common/base.component";
import { MaybeNull } from "src/app/common/app.types";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import {
    EngineDesc,
    EnginesQuery,
    GetDatasetSchemaQuery,
    SqlQueryStep,
} from "src/app/api/kamu.graphql.interface";
import { EngineService } from "src/app/services/engine.service";
import * as monaco from "monaco-editor";
import { EditSetTransformService } from "./edit-set-transform..service";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import ProjectLinks from "src/app/project-links";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetNode, SetTransFormYamlType } from "./set-transform.types";
import { ViewportScroller } from "@angular/common";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { TemplatesYamlEventsService } from "src/app/services/templates-yaml-events.service";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { EditPollingSourceService } from "../add-polling-source/edit-polling-source.service";
@Component({
    selector: "app-set-transform",
    templateUrl: "./set-transform.component.html",
    styleUrls: ["./set-transform.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformComponent extends BaseComponent implements OnInit {
    public searchDataset = "";
    private readonly delayTime: number = AppValues.SHORT_DELAY_MS;
    private inputDatasets = new Set([] as string[]);
    public knownEngines: MaybeNull<EngineDesc[]>;
    public selectedEngine: string;
    public selectedImage: string;
    public images: string[];
    public eventYamlByHash: MaybeNull<string>;
    public history: DatasetHistoryUpdate;
    public currentSetTransformEvent: SetTransFormYamlType;
    public queries: Omit<SqlQueryStep, "__typename">[] = [];
    public readonly sqlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
        {
            theme: "vs",
            language: "sql",
            renderLineHighlight: "none",
            minimap: {
                enabled: false,
            },
        };
    public treeControl = new NestedTreeControl<DatasetNode>(
        (node) => node.children,
    );
    public dataSource = new MatTreeNestedDataSource<DatasetNode>();
    private TREE_DATA: DatasetNode[] = [];

    constructor(
        private appSearchAPI: SearchApi,
        private datasetService: DatasetService,
        private engineService: EngineService,
        private cdr: ChangeDetectorRef,
        private editSetTransformService: EditSetTransformService,
        private editService: EditPollingSourceService,
        private activatedRoute: ActivatedRoute,
        private scroll: ViewportScroller,
        private modalService: NgbModal,
        private yamlEventService: TemplatesYamlEventsService,
        private createDatasetService: AppDatasetCreateService,
    ) {
        super();
    }
    ngOnInit(): void {
        this.initEngineSection();
        this.initQueriesSection();
    }

    private initEngineSection(): void {
        this.trackSubscriptions(
            this.engineService.engines().subscribe((result: EnginesQuery) => {
                this.knownEngines = result.data.knownEngines;
                this.selectedEngine = this.knownEngines[0].name.toUpperCase();
                this.selectedImage = this.knownEngines[0].latestImage;
                this.cdr.detectChanges();
            }),
        );
    }

    private initQueriesSection(): void {
        this.trackSubscription(
            this.editService
                .getEventAsYaml(this.getDatasetInfoFromUrl(), "SetTransform")
                .subscribe((result: string | null | undefined) => {
                    if (result) {
                        this.eventYamlByHash = result;
                        this.currentSetTransformEvent =
                            this.editSetTransformService.parseEventFromYaml(
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
                        this.initCurrentEngine();
                    } else {
                        this.initDefaultQueriesSection();
                    }
                    this.history = this.editService.history;
                }),
        );
    }

    private initDefaultQueriesSection(query = ""): void {
        this.queries.push({
            alias: this.getDatasetInfoFromUrl().datasetName,
            query,
        });
        this.cdr.detectChanges();
    }

    private getInputDatasetsInfo(): void {
        this.currentSetTransformEvent.inputs.forEach((item: TransformInput) => {
            this.inputDatasets.add(JSON.stringify(item));
            this.trackSubscription(
                this.datasetService
                    .requestDatasetSchema(item.id as string)
                    .subscribe((data: GetDatasetSchemaQuery) => {
                        if (data.datasets.byId) {
                            const schema: MaybeNull<DatasetSchema> = data
                                .datasets.byId.metadata.currentSchema
                                ? (JSON.parse(
                                      data.datasets.byId.metadata.currentSchema
                                          .content,
                                  ) as DatasetSchema)
                                : null;
                            this.TREE_DATA.push({
                                name: item.name as string,
                                children: schema?.fields,
                            });
                            this.dataSource.data = this.TREE_DATA;
                        }
                    }),
            );
        });
    }

    private initCurrentEngine(): void {
        const currentEngine: string =
            this.currentSetTransformEvent.transform.engine;
        this.selectedEngine = currentEngine.toUpperCase();
        this.onSelectType();
        this.cdr.detectChanges();
    }

    private getDatasetInfoFromUrl(): DatasetInfo {
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

    public isLastQuery(index: number): boolean {
        return index === this.queries.length - 1;
    }

    public isPenultimateQuery(index: number): boolean {
        return index === this.queries.length - 2;
    }

    public hasChild(_: number, node: DatasetNode): boolean {
        return !!node.children && node.children.length > 0;
    }

    public onSelectType(): void {
        if (this.knownEngines) {
            const result = this.knownEngines.find(
                (item) => item.name.toUpperCase() === this.selectedEngine,
            );
            if (result) this.selectedImage = result.latestImage;
        }
    }

    public deleteInputDataset(datasetName: string): void {
        this.TREE_DATA = this.TREE_DATA.filter(
            (item: DatasetNode) => item.name !== datasetName,
        );
        this.dataSource.data = this.TREE_DATA;
        this.inputDatasets.forEach((item) => {
            if (item.includes(datasetName)) {
                this.inputDatasets.delete(item);
            }
        });
    }

    public search: OperatorFunction<
        string,
        readonly DatasetAutocompleteItem[]
    > = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(this.delayTime),
            distinctUntilChanged(),
            switchMap((term: string) =>
                this.appSearchAPI.autocompleteDatasetSearch(term),
            ),
        );
    };

    public formatter(x: DatasetAutocompleteItem | string): string {
        return typeof x !== "string" ? (x.dataset.name as string) : x;
    }

    public onSelectItem(event: NgbTypeaheadSelectItemEvent): void {
        const value = event.item as DatasetAutocompleteItem;
        const id = value.dataset.id as string;
        const name = value.dataset.name as string;
        const inputDataset = JSON.stringify({
            id,
            name,
        });
        if (
            value.__typename !== "all" &&
            !this.inputDatasets.has(inputDataset)
        ) {
            this.inputDatasets.add(inputDataset);
            this.trackSubscription(
                this.datasetService
                    .requestDatasetSchema(id)
                    .subscribe((data: GetDatasetSchemaQuery) => {
                        if (data.datasets.byId) {
                            const schema: MaybeNull<DatasetSchema> = data
                                .datasets.byId.metadata.currentSchema
                                ? (JSON.parse(
                                      data.datasets.byId.metadata.currentSchema
                                          .content,
                                  ) as DatasetSchema)
                                : null;
                            this.TREE_DATA.push({
                                name: value.dataset.name as string,
                                children: schema?.fields,
                            });
                            this.dataSource.data = this.TREE_DATA;
                        }
                    }),
            );
        }
    }

    public clearSearch(): void {
        this.searchDataset = "";
    }

    public addQuery(): void {
        this.queries.unshift({
            alias: "",
            query: "",
        });
        this.scroll.scrollToPosition([0, 0]);
    }

    public deleteQuery(index: number): void {
        this.queries.splice(index, 1);
    }

    public swap(index: number, direction: number): void {
        const condition =
            direction > 0 ? index === this.queries.length - 1 : index === 0;
        if (condition) {
            return;
        }
        const current = this.queries.find((_, i) => index === i);
        this.queries.splice(index, 1);
        if (current) {
            this.queries.splice(index + direction, 0, current);
        }
    }

    public onEditYaml(): void {
        const modalRef: NgbModalRef = this.modalService.open(
            FinalYamlModalComponent,
            { size: "lg" },
        );
        (modalRef.componentInstance as FinalYamlModalComponent).yamlTemplate =
            this.yamlEventService.buildYamlSetTransformEvent(
                this.editSetTransformService.transformEventAsObject(
                    this.inputDatasets,
                    this.selectedEngine,
                    this.queries,
                ),
            );
        (modalRef.componentInstance as FinalYamlModalComponent).datasetInfo =
            this.getDatasetInfoFromUrl();
    }

    public onSaveEvent(): void {
        this.trackSubscription(
            this.createDatasetService
                .commitEventToDataset(
                    this.getDatasetInfoFromUrl().accountName,
                    this.getDatasetInfoFromUrl().datasetName,
                    this.yamlEventService.buildYamlSetTransformEvent(
                        this.editSetTransformService.transformEventAsObject(
                            this.inputDatasets,
                            this.selectedEngine,
                            this.queries,
                        ),
                    ),
                )
                .subscribe(),
        );
    }
}
