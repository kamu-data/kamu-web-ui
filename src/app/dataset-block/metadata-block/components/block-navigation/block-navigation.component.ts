import { SupportedEvents } from "./../event-details/supported.events";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-block-navigation",
    templateUrl: "./block-navigation.component.html",
    styleUrls: ["./block-navigation.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockNavigationComponent {
    public searchHash = "";
    public eventType = this.sortOptions[0];

    public get sortOptions() {
        return ["None", ...Object.keys(SupportedEvents)];
    }
}
