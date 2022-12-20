import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlockHashFilterPipe } from "./block-hash-filter.pipe";

@NgModule({
    declarations: [BlockHashFilterPipe],
    exports: [BlockHashFilterPipe],
    imports: [CommonModule],
})
export class BlockHashFilterModule {}
