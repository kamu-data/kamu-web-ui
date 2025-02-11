import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BatchingTriggerFormComponent } from "./batching-trigger-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [BatchingTriggerFormComponent],
    exports: [BatchingTriggerFormComponent],
    imports: [CommonModule, FormsModule, MatSlideToggleModule, ReactiveFormsModule],
})
export class BatchingTriggerModule {}
