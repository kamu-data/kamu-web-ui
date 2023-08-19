import { NavigationService } from "../../services/navigation.service";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AccountBasicsFragment, MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { DataHelpers } from "src/app/common/data.helpers";

@Component({
    selector: "app-overview-history-summary-header",
    templateUrl: "./overview-history-summary-header.component.html",
    styleUrls: ["./overview-history-summary-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewHistorySummaryHeaderComponent {
    @Input() public metadataBlockFragment?: MetadataBlockFragment;
    @Input() public numBlocksTotal: number;
    @Input() public datasetName: string;

    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;

    constructor(private navigationService: NavigationService) {}

    get systemTime(): string {
        return this.metadataBlockFragment ? this.metadataBlockFragment.systemTime : "";
    }

    get authorInfo(): AccountBasicsFragment {
        return this.metadataBlockFragment
            ? this.metadataBlockFragment.author
            : { id: "", accountName: AppValues.DEFAULT_USER_DISPLAY_NAME };
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
