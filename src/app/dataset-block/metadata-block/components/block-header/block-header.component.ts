import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    selector: "app-block-header",
    templateUrl: "./block-header.component.html",
    styleUrls: ["./block-header.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockHeaderComponent {}
