import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventTypeFilterPipe } from "./event-type-filter.pipe";

@NgModule({
    declarations: [EventTypeFilterPipe],
    exports: [EventTypeFilterPipe],
    imports: [CommonModule],
})
export class EventTypeFilterModule {}
