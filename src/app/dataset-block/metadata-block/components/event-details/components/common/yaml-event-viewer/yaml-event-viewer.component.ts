import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-yaml-event-viewer",
    templateUrl: "./yaml-event-viewer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlEventViewerComponent {
    @Input() public event: string;
}
