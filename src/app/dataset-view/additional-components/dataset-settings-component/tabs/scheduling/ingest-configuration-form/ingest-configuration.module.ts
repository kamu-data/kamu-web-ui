import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IngestConfigurationFormComponent } from "./ingest-configuration-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";

@NgModule({
    declarations: [IngestConfigurationFormComponent],
    exports: [IngestConfigurationFormComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCheckboxModule],
})
export class IngestConfigurationModule {}
