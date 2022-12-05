import ProjectLinks from "src/app/project-links";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import AppValues from "../../common/app.values";
import {
    MetadataBlockFragment,
    PageBasedInfo,
} from "src/app/api/kamu.graphql.interface";
import { DataHelpers } from "src/app/common/data.helpers";
import { momentConvertDatetoLocalWithFormat } from "src/app/common/app.helpers";
import { pluck } from "rxjs/operators";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["timeline.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit {
    @Input() public history: MetadataBlockFragment[];
    @Input() public pageInfo: PageBasedInfo;
    public datasetName: string;

    constructor(
        private navigationService: NavigationService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.route.params
            .pipe(pluck(ProjectLinks.URL_PARAM_DATASET_NAME))
            .subscribe(
                (datasetName: string) => (this.datasetName = datasetName),
            );
    }

    public navigateToOwnerView(ownerName: string): void {
        this.navigationService.navigateToOwnerView(ownerName);
    }

    public navigateToMetadataBlock(
        accountName: string,
        datasetName: string,
        blockHash: string,
    ): void {
        this.navigationService.navigateToMetadataBlock({
            accountName,
            datasetName,
            blockHash,
        });
    }

    public momentConverDatetoLocalWithFormat(date: string): string {
        return momentConvertDatetoLocalWithFormat({
            date: new Date(String(date)),
            format: AppValues.DISPLAY_DATE_FORMAT,
            isTextDate: true,
        });
    }

    public descriptionForMetadataBlock(block: MetadataBlockFragment): string {
        return DataHelpers.descriptionForMetadataBlock(block);
    }

    public relativeTime(time: string): string {
        return DataHelpers.relativeTime(time);
    }

    public shortHash(hash: string): string {
        return DataHelpers.shortHash(hash);
    }
}
