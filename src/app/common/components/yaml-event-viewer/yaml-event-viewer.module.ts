import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { YamlEventViewerComponent } from "./yaml-event-viewer.component";
import { HighlightModule } from "ngx-highlightjs";

@NgModule({
    declarations: [YamlEventViewerComponent],
    exports: [YamlEventViewerComponent],
    imports: [CommonModule, HighlightModule],
})
export class YamlEventViewerModule {}
