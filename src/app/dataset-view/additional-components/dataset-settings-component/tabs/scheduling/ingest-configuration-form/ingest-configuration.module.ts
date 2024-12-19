import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IngestConfigurationFormComponent } from "./ingest-configuration-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [IngestConfigurationFormComponent],
    exports: [IngestConfigurationFormComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class IngestConfigurationModule {}
