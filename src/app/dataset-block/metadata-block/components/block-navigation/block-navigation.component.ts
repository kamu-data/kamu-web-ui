import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-block-navigation",
    templateUrl: "./block-navigation.component.html",
    styleUrls: ["./block-navigation.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockNavigationComponent {}
