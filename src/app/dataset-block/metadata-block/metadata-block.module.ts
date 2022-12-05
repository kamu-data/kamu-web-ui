import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MetadataBlockComponent } from "./metadata-block.component";
import { DatasetModule } from "src/app/dataset-view/dataset.module";

@NgModule({
    declarations: [MetadataBlockComponent],
    imports: [CommonModule, DatasetModule],
    exports: [MetadataBlockComponent],
})
export class MetadataBlockModule {}
