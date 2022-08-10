import { Component, Input } from "@angular/core";
import AppValues from "../../common/app.values";
import { DataHelpersService } from "src/app/services/datahelpers.service";
import {
    MetadataBlockFragment,
    PageBasedInfo,
} from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["timeline.component.sass"],
})
export class TimelineComponent {
    @Input() public history: MetadataBlockFragment[];
    @Input() public pageInfo: PageBasedInfo;

    constructor(public dataHelpers: DataHelpersService) {}

    public momentConverDatetoLocalWithFormat(date: string): string {
        return AppValues.momentConverDatetoLocalWithFormat({
            date: new Date(String(date)),
            format: "DD MMM YYYY",
            isTextDate: true,
        });
    }
    public shortHash(hash: string): string {
        return hash.slice(-8);
    }
}
