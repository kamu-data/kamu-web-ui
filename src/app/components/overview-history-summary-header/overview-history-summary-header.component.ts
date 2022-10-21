import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    Account,
    MetadataBlockFragment,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { DataHelpers } from "src/app/common/data.helpers";

@Component({
    selector: "app-overview-history-summary-header",
    templateUrl: "./overview-history-summary-header.component.html",
    styleUrls: ["./overview-history-summary-header.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewHistorySummaryHeaderComponent {
    @Input() public metadataBlockFragment?: MetadataBlockFragment;
    @Input() public numBlocksTotal: number;
    public appLogo = `/${AppValues.appLogo}`;

    get systemTime(): string {
        return this.metadataBlockFragment
            ? (this.metadataBlockFragment.systemTime as string)
            : "";
    }

    get authorInfo(): Account {
        return this.metadataBlockFragment
            ? this.metadataBlockFragment.author
            : { id: "", name: AppValues.defaultUsername };
    }

    get blockHash(): string {
        return this.metadataBlockFragment
            ? (this.metadataBlockFragment.blockHash as string)
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
