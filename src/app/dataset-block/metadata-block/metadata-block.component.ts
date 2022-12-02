import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-metadata-block",
    templateUrl: "./metadata-block.component.html",
    styleUrls: ["./metadata-block.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataBlockComponent {}
