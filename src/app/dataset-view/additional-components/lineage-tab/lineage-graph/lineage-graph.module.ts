import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LineageGraphComponent } from "./lineage-graph.component";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { MatIconModule } from "@angular/material/icon";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { DisplayTimeModule } from "src/app/components/display-time/display-time.module";

@NgModule({
    imports: [CommonModule, FormsModule, NgxGraphModule, MatIconModule, DisplaySizeModule, DisplayTimeModule],
    exports: [LineageGraphComponent],
    declarations: [LineageGraphComponent],
})
export class LineageGraphModule {
    public static forRoot(): ModuleWithProviders<LineageGraphModule> {
        return { ngModule: LineageGraphModule };
    }
}
