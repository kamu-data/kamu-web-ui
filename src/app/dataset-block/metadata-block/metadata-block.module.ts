import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MetadataBlockComponent } from "./metadata-block.component";

@NgModule({
    declarations: [MetadataBlockComponent],
    imports: [CommonModule],
    exports: [MetadataBlockComponent],
})
export class MetadataBlockModule {}
