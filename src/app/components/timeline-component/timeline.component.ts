import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MetadataBlockFragment, PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { DataHelpers } from "src/app/common/data.helpers";
import AppValues from "src/app/common/app.values";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["timeline.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
    @Input({ required: true }) public history: MetadataBlockFragment[];
    @Input({ required: true }) public pageInfo: PageBasedInfo;
    @Input({ required: true }) public datasetName: string;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly URL_BLOCK = ProjectLinks.URL_BLOCK;

    public descriptionForMetadataBlock(block: MetadataBlockFragment): string {
        return DataHelpers.descriptionForMetadataBlock(block);
    }

    public setTimelineItemIcon(block: MetadataBlockFragment): string {
        return DataHelpers.setTimelineItemIcon(block);
    }
}
