import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
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
    DataQueries,
    EngineDesc,
    EnginesQuery,
    GetDatasetSchemaQuery,
    SqlQueryStep,
} from "src/app/api/kamu.graphql.interface";
import { EngineService } from "src/app/services/engine.service";
import * as monaco from "monaco-editor";

interface DatasetNode {
    name: string;
    type?: string;
    children?: DatasetNode[];
}

@Component({
    selector: "app-set-transform",
    templateUrl: "./set-transform.component.html",
    styleUrls: ["./set-transform.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformComponent extends BaseComponent implements OnInit {
    public searchDataset = "";
    private delayTime: number = AppValues.SHORT_DELAY_MS;
    private inputDatasets = new Set([] as string[]);
    public knownEngines: EngineDesc[];
    public selectedEngine: string;
    public selectedImage = "test";
    public images: string[];

    public queries: Omit<SqlQueryStep, "__typename">[] = [
        {
            alias: "",
            query: "",
        },
    ];

    public readonly sqlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
        {
            theme: "vs",
            language: "yaml",
            renderLineHighlight: "none",
            minimap: {
                enabled: false,
            },
        };

    ///-----------------------------
    private TREE_DATA: DatasetNode[] = [];
    public treeControl = new NestedTreeControl<DatasetNode>(
        (node) => node.children,
    );
    public dataSource = new MatTreeNestedDataSource<DatasetNode>();

    ///----- end

    constructor(
        private appSearchAPI: SearchApi,
        private datasetService: DatasetService,
        private engineService: EngineService,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }
    ngOnInit(): void {
        this.engineService.engines().subscribe((result: EnginesQuery) => {
            this.knownEngines = result.data.knownEngines;
            this.selectedEngine = this.knownEngines[0].name;
            this.selectedImage = this.knownEngines[0].latestImage;
            this.cdr.detectChanges();
        });
    }

    public isLastQuery(index: number): boolean {
        return index === this.queries.length - 1;
    }

    public hasChild(_: number, node: DatasetNode): boolean {
        return !!node.children && node.children.length > 0;
    }

    public onSelectType(): void {
        const result = this.knownEngines.find(
            (item) => item.name === this.selectedEngine,
        );
        if (result) this.selectedImage = result.latestImage;
    }

    public deleteInputDataset(datasetName: string): void {
        this.TREE_DATA = this.TREE_DATA.filter(
            (item: DatasetNode) => item.name !== datasetName,
        );
        this.dataSource.data = this.TREE_DATA;
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
        this.queries.push({
            alias: "",
            query: "",
        });
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
}
