import { NavigationService } from "./../../services/navigation.service";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Account, MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
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
    @Input() public datasetName: string;
    public appLogo = `/${AppValues.APP_LOGO}`;

    constructor(private navigationService: NavigationService) {}

    get systemTime(): string {
        return this.metadataBlockFragment ? this.metadataBlockFragment.systemTime : "";
    }

    get authorInfo(): Account {
        return this.metadataBlockFragment
            ? this.metadataBlockFragment.author
            : { id: "", name: AppValues.DEFAULT_USERNAME };
    }

    get descriptionForMetadataBlock(): string {
        return this.metadataBlockFragment ? DataHelpers.descriptionForMetadataBlock(this.metadataBlockFragment) : "";
    }

    public navigateToMetadataBlock(accountName: string, datasetName: string, blockHash: string): void {
        this.navigationService.navigateToMetadataBlock({
            accountName,
            datasetName,
            blockHash,
        });
    }
}
