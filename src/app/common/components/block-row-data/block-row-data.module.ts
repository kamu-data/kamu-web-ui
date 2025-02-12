import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlockRowDataComponent } from "./block-row-data.component";
import { TooltipIconModule } from "../tooltip-icon/tooltip-icon.module";

@NgModule({
    declarations: [BlockRowDataComponent],
    exports: [BlockRowDataComponent],
    imports: [CommonModule, TooltipIconModule],
})
export class BlockRowDataModule {}
