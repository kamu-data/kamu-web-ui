import { NgModule } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { TimelineComponent } from "./timeline.component";

@NgModule({
    imports: [
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        NgbPopoverModule,
    ],
    exports: [TimelineComponent],
    declarations: [TimelineComponent],
})
export class TimelineModule {}
