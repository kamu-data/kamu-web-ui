import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { OperatorFunction, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { SearchApi } from "src/app/api/search.api";
import AppValues from "src/app/common/app.values";
import { DatasetAutocompleteItem } from "src/app/interface/search.interface";
import { TransformSelectedInput } from "./set-transform.types";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
    MatTreeFlattener,
    MatTreeFlatDataSource,
} from "@angular/material/tree";

interface FoodNode {
    name: string;
    children?: FoodNode[];
}

let TREE_DATA: FoodNode[] = [
    // {
    //     name: "Fruit",
    //     children: [
    //         { name: "Apple" },
    //         { name: "Banana" },
    //         { name: "Fruit loops" },
    //     ],
    // },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

@Component({
    selector: "app-set-transform",
    templateUrl: "./set-transform.component.html",
    styleUrls: ["./set-transform.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformComponent implements OnDestroy {
    public searchDataset = "";
    private delayTime: number = AppValues.SHORT_DELAY_MS;
    private inputDatasets = new Set([] as string[]);

    ///-----------------------------
    private _transformer = (node: FoodNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level: level,
        };
    };

    treeControl = new FlatTreeControl<ExampleFlatNode>(
        (node) => node.level,
        (node) => node.expandable,
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.children,
    );

    dataSource = new MatTreeFlatDataSource(
        this.treeControl,
        this.treeFlattener,
    );
    ///----- end

    constructor(private appSearchAPI: SearchApi) {}

    ngOnDestroy(): void {
        TREE_DATA = [];
    }

    public hasChild(_: number, node: ExampleFlatNode): boolean {
        return node.expandable;
    }

    public get selectedDatasets(): TransformSelectedInput[] {
        return Array.from(this.inputDatasets).map(
            (item) => JSON.parse(item) as TransformSelectedInput,
        );
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
        if (value.__typename !== "all") {
            this.inputDatasets.add(
                JSON.stringify({
                    id: value.dataset.id as string,
                    name: value.dataset.name as string,
                }),
            );
            TREE_DATA.push({
                name: value.dataset.name as string,
                children: [{ name: "id (BIGINT)" }],
            });
            console.log("array=", TREE_DATA);
            this.dataSource.data = TREE_DATA;
        }
    }

    public clearSearch(): void {
        this.searchDataset = "";
    }
}
