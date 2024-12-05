import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DataAccessBaseTabComponent } from "../data-access-base-tab.component";
import { OdataProtocolDesc } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-data-access-odata-tab",
    templateUrl: "./data-access-odata-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessOdataTabComponent extends DataAccessBaseTabComponent {
    @Input({ required: true }) public odata: OdataProtocolDesc;
}
