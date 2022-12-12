import { DisplayHashModule } from "src/app/components/display-hash/dispaly-hash.module";
import { DisplayTimeModule } from "./../display-time/display-time.module";
import { NgModule } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { TimelineComponent } from "./timeline.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        NgbPopoverModule,
        AngularSvgIconModule,
        RouterModule,
        DisplayTimeModule,
        DisplayHashModule,
    ],
    exports: [TimelineComponent],
    declarations: [TimelineComponent],
})
export class TimelineModule {}
