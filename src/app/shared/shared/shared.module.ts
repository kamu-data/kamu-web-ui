import { TooltipIconComponent } from "../../dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlockRowDataComponent } from "src/app/dataset-block/metadata-block/components/block-row-data/block-row-data.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { HighlightModule } from "ngx-highlightjs";
import { DynamicTableModule } from "src/app/common/components/dynamic-table/dynamic-table.module";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { MarkdownModule } from "ngx-markdown";
import { SafeHtmlPipe } from "src/app/common/pipes/safe-html.pipe";
import { DragAndDropDirective } from "src/app/common/directives/drag-and-drop.directive";
import { YamlEventViewerComponent } from "src/app/common/components/yaml-event-viewer/yaml-event-viewer.component";
import { RouterModule } from "@angular/router";
import { FeatureFlagDirective } from "src/app/common/directives/feature-flag.directive";

@NgModule({
    declarations: [
        BlockRowDataComponent,
        TooltipIconComponent,
        SafeHtmlPipe,
        DragAndDropDirective,
        FeatureFlagDirective,
        YamlEventViewerComponent,
    ],
    imports: [
        CommonModule,
        NgbTooltipModule,
        MatIconModule,
        HighlightModule,
        DynamicTableModule,
        DisplaySizeModule,
        MarkdownModule,
        RouterModule,
    ],
    exports: [
        BlockRowDataComponent,
        MatIconModule,
        TooltipIconComponent,
        MarkdownModule,
        DisplaySizeModule,
        SafeHtmlPipe,
        DragAndDropDirective,
        FeatureFlagDirective,
        YamlEventViewerComponent,
    ],
})
export class SharedModule {}
