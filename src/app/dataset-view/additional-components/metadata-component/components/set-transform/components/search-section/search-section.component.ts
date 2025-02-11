import { NestedTreeControl } from "@angular/cdk/tree";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { OperatorFunction, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { DatasetBasicsFragment, GetDatasetSchemaQuery } from "src/app/api/kamu.graphql.interface";
import { SearchApi } from "src/app/api/search.api";
import { MaybeNull } from "src/app/common/types/app.types";
import AppValues from "src/app/common/values/app.values";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { DatasetNode } from "../../set-transform.types";
import { BaseComponent } from "src/app/common/components/base.component";
import { parseCurrentSchema } from "src/app/common/helpers/app.helpers";
import { NavigationService } from "src/app/services/navigation.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-search-section",
    templateUrl: "./search-section.component.html",
    styleUrls: ["./search-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchSectionComponent extends BaseComponent {
    public searchDataset = "";
    private readonly delayTime: number = AppValues.SHORT_DELAY_MS;
    @Input({ required: true }) public inputDatasets: Set<string>;

    public treeControl = new NestedTreeControl<DatasetNode>((node) => node.children);
    @Input({ required: true }) public dataSource: MatTreeNestedDataSource<DatasetNode>;
    @Input({ required: true }) public TREE_DATA: DatasetNode[];
    public readonly UNAVAILABLE_INPUT_LABEL: string = AppValues.SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL;

    private appSearchAPI = inject(SearchApi);
    private datasetService = inject(DatasetService);
    private navigationService = inject(NavigationService);

    public search: OperatorFunction<string, readonly DatasetAutocompleteItem[]> = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(this.delayTime),
            distinctUntilChanged(),
            switchMap((term: string) => this.appSearchAPI.autocompleteDatasetSearch(term)),
        );
    };

    public formatter(x: DatasetAutocompleteItem | string): string {
        return typeof x !== "string" ? x.dataset.name : x;
    }

    public onSelectItem(event: NgbTypeaheadSelectItemEvent): void {
        const value = event.item as DatasetAutocompleteItem;
        const id = value.dataset.id;
        const alias = value.dataset.alias;
        const inputDataset = JSON.stringify({
            datasetRef: id,
            alias,
        });
        if (value.__typename !== TypeNames.allDataType && !this.inputDatasets.has(inputDataset)) {
            this.inputDatasets.add(inputDataset);

            this.datasetService
                .requestDatasetSchema(id)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data: GetDatasetSchemaQuery) => {
                    if (data.datasets.byId) {
                        const owner = (data.datasets.byId as DatasetBasicsFragment).owner.accountName;
                        const schema: MaybeNull<DatasetSchema> = parseCurrentSchema(
                            data.datasets.byId.metadata.currentSchema,
                        );

                        this.TREE_DATA.push({
                            name: value.dataset.name,
                            children: schema?.fields.length
                                ? schema.fields
                                : [{ name: "No schema", type: "", repetition: "" }],
                            owner,
                        });
                        this.dataSource.data = this.TREE_DATA;
                    }
                });
        }
    }

    public clearSearch(): void {
        this.searchDataset = "";
    }

    public deleteInputDataset(alias: string): void {
        this.TREE_DATA = this.TREE_DATA.filter((item: DatasetNode) => `${item.owner}/${item.name}` !== alias);
        this.dataSource.data = this.TREE_DATA;
        this.inputDatasets.forEach((item) => {
            if (item.includes(alias)) {
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
