import { ChangeDetectionStrategy, Component } from "@angular/core";
import DataTabValues from "../mock.data";

@Component({
    selector: "app-saved-queries-section",
    templateUrl: "./saved-queries-section.component.html",
    styleUrls: ["./saved-queries-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedQueriesSectionComponent {
    public savedQueries = DataTabValues.savedQueries;
}