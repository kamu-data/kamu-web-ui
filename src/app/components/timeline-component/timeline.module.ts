import { DisplayHashModule } from "src/app/components/display-hash/display-hash.module";
import { DisplayTimeModule } from "../display-time/display-time.module";
import { NgModule } from "@angular/core";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
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
