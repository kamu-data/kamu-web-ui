import { NestedTreeControl } from "@angular/cdk/tree";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { OperatorFunction, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { DatasetBasicsFragment, GetDatasetSchemaQuery } from "src/app/api/kamu.graphql.interface";
import { SearchApi } from "src/app/api/search.api";
import { MaybeNull } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { DatasetNode } from "../../set-transform.types";
import { BaseComponent } from "src/app/common/base.component";
import { parseCurrentSchema } from "src/app/common/app.helpers";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-search-section",
    templateUrl: "./search-section.component.html",
    styleUrls: ["./search-section.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchSectionComponent extends BaseComponent {
    public searchDataset = "";
    private readonly delayTime: number = AppValues.SHORT_DELAY_MS;
    @Input() public inputDatasets: Set<string>;

    public treeControl = new NestedTreeControl<DatasetNode>((node) => node.children);
    @Input() public dataSource: MatTreeNestedDataSource<DatasetNode>;
    @Input() public TREE_DATA: DatasetNode[];
    constructor(
        private appSearchAPI: SearchApi,
        private datasetService: DatasetService,
        private navigationService: NavigationService,
    ) {
        super();
    }

    public search: OperatorFunction<string, readonly DatasetAutocompleteItem[]> = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(this.delayTime),
            distinctUntilChanged(),
            switchMap((term: string) => this.appSearchAPI.autocompleteDatasetSearch(term)),
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
        if (value.__typename !== TypeNames.allDataType && !this.inputDatasets.has(inputDataset)) {
            this.inputDatasets.add(inputDataset);
            this.trackSubscription(
                this.datasetService.requestDatasetSchema(id).subscribe((data: GetDatasetSchemaQuery) => {
                    if (data.datasets.byId) {
                        const owner = (data.datasets.byId as DatasetBasicsFragment).owner.name;
                        const schema: MaybeNull<DatasetSchema> = parseCurrentSchema(
                            data.datasets.byId.metadata.currentSchema,
                        );
                        this.TREE_DATA.push({
                            name: value.dataset.name as string,
                            children: schema?.fields,
                            owner,
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

    public deleteInputDataset(datasetName: string): void {
        this.TREE_DATA = this.TREE_DATA.filter((item: DatasetNode) => item.name !== datasetName);
        this.dataSource.data = this.TREE_DATA;
        this.inputDatasets.forEach((item) => {
            if (item.includes(datasetName)) {
                this.inputDatasets.delete(item);
            }
        });
    }

    public hasChild(_: number, node: DatasetNode): boolean {
        return !!node.children && node.children.length > 0;
    }

    public navigateToDataset(accountName: string, datasetName: string): void {
        this.navigationService.navigateToDatasetView({
            accountName,
            datasetName,
        });
    }

    public navigateToOwner(owner: string): void {
        this.navigationService.navigateToOwnerView(owner);
    }
}
