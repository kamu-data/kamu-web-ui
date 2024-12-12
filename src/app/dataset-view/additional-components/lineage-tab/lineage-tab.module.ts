import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LineageComponent } from "./lineage-component/lineage.component";
import { LineageTabRoutingModule } from "./lineage-tab-routing.module";
import { LineageGraphModule } from "./lineage-graph/lineage-graph.module";

@NgModule({
    declarations: [LineageComponent],
    imports: [CommonModule, LineageTabRoutingModule, LineageGraphModule],
})
export class LineageTabModule {}
