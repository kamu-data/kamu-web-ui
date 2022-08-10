import {
    AfterContentInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import {
    Account,
    MetadataBlockFragment,
    Scalars,
} from "src/app/api/kamu.graphql.interface";
import { DataHelpersService } from "src/app/services/datahelpers.service";
import AppValues from "../../common/app.values";
import { TableSourceInterface } from "./dynamic-table.interface";

/* eslint-disable  @typescript-eslint/no-explicit-any */
const ELEMENT_DATA: any[] = [];
@Component({
    selector: "app-dynamic-table",
    templateUrl: "./dynamic-table.component.html",
    styleUrls: ["./dynamic-table.sass"],
})
export class DynamicTableComponent
    implements OnInit, OnChanges, AfterContentInit
{
    @Input() public hasTableHeader: boolean;
    @Input() public tableSource?: TableSourceInterface;

    @Input() public metadataBlockFragment?: MetadataBlockFragment;
    @Input() public numBlocksTotal?: number;

    @Input() public hasResultQuantity?: boolean = false;
    @Input() public resultUnitText: string;
    @Input() public isClickableRow = false;
    @Input() public idTable = "";
    @Output() public onSelectDatasetEmit: EventEmitter<string> =
        new EventEmitter();

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
    public displayedColumns: string[] = [];

    constructor(public dataHelpers: DataHelpersService) {}

    public ngOnInit(): void {
        this.tableSource && this.renderTable(this.tableSource);
    }
    public ngOnChanges(changes: SimpleChanges): void {
        this.tableSource && changes && this.renderTable(this.tableSource);
    }

    public ngAfterContentInit(): void {
        this.tableSource && this.renderTable(this.tableSource);
    }

    public changeColumnName(columnName: string): string {
        columnName = columnName.replace("_", " ");
        let newColumnName = "";

        for (let i = 0; i < columnName.length; i++) {
            if (columnName.charAt(i) === columnName.charAt(i).toUpperCase()) {
                newColumnName += " " + columnName.charAt(i);
            } else newColumnName += columnName.charAt(i);
        }
        newColumnName = newColumnName.toLocaleLowerCase();

        return AppValues.capitalizeFirstLetter(newColumnName);
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public onSelectDataset(dataset: any): void {
        this.onSelectDatasetEmit.emit(dataset);
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    private renderTable(data: any[]): void {
        if (data.length === 0) {
            this.dataSource.data = [];
            return;
        }
        this.dataSource.data = [];
        this.displayedColumns = Object.keys(data[0]);

        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const dataSource = this.dataSource.data;
        data.forEach((field: any) => {
            dataSource.push(field);
        });
        this.dataSource.data = dataSource;
        this.dataSource = new MatTableDataSource(dataSource);
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public searchResultQuantity(tableSource: any[] = []): string {
        if (!Array.isArray(tableSource)) {
            return "0";
        }
        return tableSource.length.toString();
    }

    get systemTime(): Scalars["DateTime"] {
        return this.metadataBlockFragment
            ? this.metadataBlockFragment.systemTime
            : "";
    }

    get authorInfo(): Account {
        return this.metadataBlockFragment
            ? this.metadataBlockFragment.author
            : { id: "", name: AppValues.defaultUsername };
    }

    get blockHash(): Scalars["Multihash"] {
        return this.metadataBlockFragment
            ? this.metadataBlockFragment.blockHash
            : "";
    }
}
