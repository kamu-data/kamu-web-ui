import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { RestProtocolDesc } from "src/app/api/kamu.graphql.interface";
import { DataAccessBaseTabComponent } from "../../data-access-base-tab.component";

@Component({
    selector: "app-data-access-rest-tab",
    templateUrl: "./data-access-rest-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessRestTabComponent extends DataAccessBaseTabComponent {
    @Input({ required: true }) public rest: RestProtocolDesc;
}
