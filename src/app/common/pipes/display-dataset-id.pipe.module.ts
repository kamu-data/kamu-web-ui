import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DisplayDatasetIdPipe } from "./display-dataset-id.pipe";

@NgModule({
    declarations: [DisplayDatasetIdPipe],
    exports: [DisplayDatasetIdPipe],
    imports: [CommonModule],
})
export class DisplayDatasetIdPipeModule {}
