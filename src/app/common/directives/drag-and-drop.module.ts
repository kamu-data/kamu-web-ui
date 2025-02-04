import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragAndDropDirective } from "./drag-and-drop.directive";

@NgModule({
    declarations: [DragAndDropDirective],
    exports: [DragAndDropDirective],
    imports: [CommonModule],
})
export class DragAndDropModule {}
