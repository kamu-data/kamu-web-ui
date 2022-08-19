import { Component, Input, OnInit } from "@angular/core";
import {
    Account,
    MetadataBlockFragment,
    Scalars,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { DataHelpers } from "src/app/common/data.helpers";
import { TableSourceInterface } from "../dynamic-table/dynamic-table.interface";

@Component({
    selector: "app-overview-history-summary-header",
    templateUrl: "./overview-history-summary-header.component.html",
    styleUrls: ["./overview-history-summary-header.component.sass"],
})
export class OverviewHistorySummaryHeaderComponent implements OnInit {
    @Input() public tableSource?: TableSourceInterface;
    @Input() public resultUnitText: string;
    @Input() public metadataBlockFragment?: MetadataBlockFragment;
    @Input() public hasResultQuantity?: boolean = false;
    @Input() public numBlocksTotal?: number;
    public appLogo = `/${AppValues.appLogo}`;

    constructor() {}

    ngOnInit(): void {}

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

    get relativeTime(): string {
        return DataHelpers.relativeTime(this.systemTime);
    }

    get shortHash(): string {
        return DataHelpers.shortHash(this.systemTime);
    }

    get descriptionForMetadataBlock(): string {
        return DataHelpers.descriptionForMetadataBlock(
            this.metadataBlockFragment || null,
        );
    }
}
