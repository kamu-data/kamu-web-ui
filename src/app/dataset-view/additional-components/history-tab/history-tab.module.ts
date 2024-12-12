import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HistoryComponent } from "./history-component/history.component";
import { HistoryTabRoutingModule } from "./history-tab-routing.module";
import { TimelineModule } from "src/app/components/timeline-component/timeline.module";
import { PaginationModule } from "src/app/components/pagination-component/pagination.module";

@NgModule({
    declarations: [HistoryComponent],
    imports: [CommonModule, PaginationModule, TimelineModule, HistoryTabRoutingModule],
})
export class HistoryTabModule {}
