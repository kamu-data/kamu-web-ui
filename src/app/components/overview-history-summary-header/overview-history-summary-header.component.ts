import { Component, Input } from "@angular/core";
import {
    Account,
    MetadataBlockFragment,
    Scalars,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { DataHelpers } from "src/app/common/data.helpers";

@Component({
    selector: "app-overview-history-summary-header",
    templateUrl: "./overview-history-summary-header.component.html",
    styleUrls: ["./overview-history-summary-header.component.sass"],
})
export class OverviewHistorySummaryHeaderComponent {
    @Input() public metadataBlockFragment?: MetadataBlockFragment;
    @Input() public numBlocksTotal: number;
    public appLogo = `/${AppValues.appLogo}`;

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
        return DataHelpers.shortHash(this.blockHash);
    }

    get descriptionForMetadataBlock(): string {
        return this.metadataBlockFragment
            ? DataHelpers.descriptionForMetadataBlock(
                  this.metadataBlockFragment,
              )
            : "";
    }
}
