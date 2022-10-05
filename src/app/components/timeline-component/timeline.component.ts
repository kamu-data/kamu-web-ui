import { NavigationService } from "src/app/services/navigation.service";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import AppValues from "../../common/app.values";
import {
    MetadataBlockFragment,
    PageBasedInfo,
} from "src/app/api/kamu.graphql.interface";
import {
    descriptionForMetadataBlock,
    relativeTime,
    shortHash,
} from "src/app/common/data.helpers";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["timeline.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
    @Input() public history: MetadataBlockFragment[];
    @Input() public pageInfo: PageBasedInfo;

    constructor(private navigationService: NavigationService) {}

    public navigateToOwnerView(ownerName: string): void {
        this.navigationService.navigateToOwnerView(ownerName);
    }

    public momentConverDatetoLocalWithFormat(date: string): string {
        return AppValues.momentConverDatetoLocalWithFormat({
            date: new Date(String(date)),
            format: AppValues.displayDateFormat,
            isTextDate: true,
        });
    }

    public descriptionForMetadataBlock(block: MetadataBlockFragment): string {
        return descriptionForMetadataBlock(block);
    }

    public relativeTime(time: string): string {
        return relativeTime(time);
    }

    public shortHash(hash: string): string {
        return shortHash(hash);
    }
}
