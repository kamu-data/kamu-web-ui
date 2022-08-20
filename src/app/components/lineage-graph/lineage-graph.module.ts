import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LineageGraphComponent } from "./lineage-graph.component";
import { NgxGraphModule } from "@swimlane/ngx-graph";

@NgModule({
    imports: [CommonModule, FormsModule, NgxGraphModule],
    exports: [LineageGraphComponent],
    declarations: [LineageGraphComponent],
})
export class LineageGraphModule {
    public static forRoot(): ModuleWithProviders<LineageGraphModule> {
        return { ngModule: LineageGraphModule };
    }
}
