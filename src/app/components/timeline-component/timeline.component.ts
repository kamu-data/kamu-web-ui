import { Component, Input } from "@angular/core";
import AppValues from "../../common/app.values";
import { DataHelpersService } from "src/app/services/datahelpers.service";
import {SearchResultConnection} from "../../api/kamu.graphql.interface";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["timeline.component.sass"],
})
export class TimelineComponent {
    @Input() public history: any[];
    @Input() public pageInfo: SearchResultConnection;

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
