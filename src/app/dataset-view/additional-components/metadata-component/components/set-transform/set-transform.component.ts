import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from "@angular/core";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { OperatorFunction, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { SearchApi } from "src/app/api/search.api";
import AppValues from "src/app/common/app.values";
import { DatasetAutocompleteItem } from "src/app/interface/search.interface";
import { TransformSelectedInput } from "./set-transform.types";

@Component({
    selector: "app-set-transform",
    templateUrl: "./set-transform.component.html",
    styleUrls: ["./set-transform.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformComponent {
    public searchDataset = "";
    private delayTime: number = AppValues.SHORT_DELAY_MS;
    public selectedDatasets: TransformSelectedInput[] = [];

    constructor(
        private appSearchAPI: SearchApi,
        private cdr: ChangeDetectorRef,
    ) {}

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
        console.log("==>", value);
        if (value.__typename !== "all") {
            this.selectedDatasets.push({
                id: value.dataset.id as string,
                name: value.dataset.name as string,
            });
        }
    }

    public clearSearch(): void {
        this.searchDataset = "";
    }
}
