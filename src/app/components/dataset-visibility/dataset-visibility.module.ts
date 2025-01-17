import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatasetVisibilityComponent } from "./dataset-visibility.component";

@NgModule({
    declarations: [DatasetVisibilityComponent],
    exports: [DatasetVisibilityComponent],
    imports: [CommonModule],
})
export class DatasetVisibilityModule {}
