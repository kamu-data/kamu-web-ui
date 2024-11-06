import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DataAccessBaseTabComponent } from "../data-access-base-tab.component";
import { LinkProtocolDesc } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-data-access-link-tab",
    templateUrl: "./data-access-link-tab.component.html",
    styleUrls: ["./data-access-link-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessLinkTabComponent extends DataAccessBaseTabComponent {
    @Input({ required: true }) public webLink: LinkProtocolDesc;
}
