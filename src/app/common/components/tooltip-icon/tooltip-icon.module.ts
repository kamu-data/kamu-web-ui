import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TooltipIconComponent } from "./tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
    declarations: [TooltipIconComponent],
    exports: [TooltipIconComponent],
    imports: [CommonModule, NgbTooltipModule, MatIconModule],
})
export class TooltipIconModule {}
