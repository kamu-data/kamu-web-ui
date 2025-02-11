import { DisplayHashModule } from "src/app/common/components/display-hash/display-hash.module";
import { DisplayTimeModule } from "src/app/common/components/display-time/display-time.module";
import { NgModule } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { TimelineComponent } from "./timeline.component";
import { RouterModule } from "@angular/router";
import { FeatureFlagModule } from "../../directives/feature-flag.module";

@NgModule({
    imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        NgbPopoverModule,
        RouterModule,

        DisplayHashModule,
        DisplayTimeModule,
        FeatureFlagModule,
    ],
    exports: [TimelineComponent],
    declarations: [TimelineComponent],
})
export class TimelineModule {}
