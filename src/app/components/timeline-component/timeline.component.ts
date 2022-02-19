import {Component, Input} from "@angular/core";
import {PageInfoInterface} from "../../interface/search.interface";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["timeline.component.sass"],
})
export class TimelineComponent {
    @Input() public pageInfo: PageInfoInterface;
}
