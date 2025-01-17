import { DisplayHashModule } from "src/app/components/display-hash/display-hash.module";
import { DisplayTimeModule } from "../display-time/display-time.module";
import { NgModule } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { TimelineComponent } from "./timeline.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared/shared.module";

@NgModule({
    imports: [
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        NgbPopoverModule,
        RouterModule,
        DisplayTimeModule,
        DisplayHashModule,
        SharedModule,
    ],
    exports: [TimelineComponent],
    declarations: [TimelineComponent],
})
export class TimelineModule {}
