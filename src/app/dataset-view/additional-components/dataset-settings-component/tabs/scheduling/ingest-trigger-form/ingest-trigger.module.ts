import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IngestTriggerFormComponent } from "./ingest-trigger-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@NgModule({
    declarations: [IngestTriggerFormComponent],
    exports: [IngestTriggerFormComponent],

    imports: [CommonModule, FormsModule, MatSlideToggleModule, MatRadioModule, ReactiveFormsModule],
})
export class IngestTriggerModule {}
