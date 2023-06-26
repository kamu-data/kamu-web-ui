import { ChangeDetectionStrategy, Component } from "@angular/core";
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
import { GetDatasetSchemaQuery } from "src/app/api/kamu.graphql.interface";

interface FoodNode {
    name: string;
    type?: string;
    children?: FoodNode[];
}

@Component({
    selector: "app-set-transform",
    templateUrl: "./set-transform.component.html",
    styleUrls: ["./set-transform.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformComponent extends BaseComponent {
    public searchDataset = "";
    private delayTime: number = AppValues.SHORT_DELAY_MS;
    private inputDatasets = new Set([] as string[]);

    ///-----------------------------
    private TREE_DATA: FoodNode[] = [];
    public treeControl = new NestedTreeControl<FoodNode>(
        (node) => node.children,
    );
    public dataSource = new MatTreeNestedDataSource<FoodNode>();

    ///----- end

    constructor(
        private appSearchAPI: SearchApi,
        private datasetService: DatasetService,
    ) {
        super();
    }

    public hasChild(_: number, node: FoodNode): boolean {
        return !!node.children && node.children.length > 0;
    }

    public deleteInputDataset(datasetName: string): void {
        this.TREE_DATA = this.TREE_DATA.filter(
            (item: FoodNode) => item.name !== datasetName,
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
}
