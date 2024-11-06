import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CliProtocolDesc } from "src/app/api/kamu.graphql.interface";
import { DataAccessBaseTabComponent } from "../data-access-base-tab.component";

@Component({
    selector: "app-data-access-kamu-cli-tab",
    templateUrl: "./data-access-kamu-cli-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessKamuCliTabComponent extends DataAccessBaseTabComponent {
    @Input({ required: true }) public cli: CliProtocolDesc;
}
