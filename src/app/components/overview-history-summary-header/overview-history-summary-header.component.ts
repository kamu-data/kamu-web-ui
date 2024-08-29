import { MaybeUndefined } from "src/app/common/app.types";
import { NavigationService } from "../../services/navigation.service";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AccountExtendedFragment, MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { DataHelpers } from "src/app/common/data.helpers";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-overview-history-summary-header",
    templateUrl: "./overview-history-summary-header.component.html",
    styleUrls: ["./overview-history-summary-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewHistorySummaryHeaderComponent {
    @Input({ required: true }) public metadataBlockFragment: MaybeUndefined<MetadataBlockFragment>;
    @Input({ required: true }) public numBlocksTotal: number;
    @Input({ required: true }) public datasetName: string;

    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;

    constructor(private navigationService: NavigationService) {}

    get systemTime(): string {
        return this.metadataBlockFragment ? this.metadataBlockFragment.systemTime : "";
    }

    get authorInfo(): AccountExtendedFragment {
        return this.metadataBlockFragment?.author
            ? this.metadataBlockFragment.author
            : {
                  id: "",
                  accountName: AppValues.DEFAULT_USER_DISPLAY_NAME,
                  avatarUrl: AppValues.DEFAULT_AVATAR_URL,
              };
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

    public navigateToHistory(accountName: string, datasetName: string): void {
        this.navigationService.navigateToDatasetView({
            accountName,
            datasetName,
            tab: DatasetViewTypeEnum.History,
        });
    }
}
