import { NavigationService } from "src/app/services/navigation.service";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MetadataBlockFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { DataHelpers } from "src/app/common/data.helpers";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["timeline.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
    @Input() public history: MetadataBlockFragment[];
    @Input() public pageInfo: PageBasedInfo;
    @Input() public datasetName: string;
    public defaultAvatar = AppValues.DEFAULT_AVATAR_URL;

    constructor(private navigationService: NavigationService) {}

    public navigateToOwnerView(ownerName: string): void {
        this.navigationService.navigateToOwnerView(ownerName);
    }

    public navigateToMetadataBlock(accountName: string, datasetName: string, blockHash: string): void {
        this.navigationService.navigateToMetadataBlock({
            accountName,
            datasetName,
            blockHash,
        });
    }

    public descriptionForMetadataBlock(block: MetadataBlockFragment): string {
        return DataHelpers.descriptionForMetadataBlock(block);
    }
}
