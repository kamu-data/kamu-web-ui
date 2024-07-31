import { ModuleWithProviders, NgModule } from "@angular/core";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { CommonModule } from "@angular/common";
import { DatasetCreateComponent } from "./dataset-create.component";
import { SearchAdditionalButtonsModule } from "../components/search-additional-buttons/search-additional-buttons.module";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { AngularSvgIconModule } from "angular-svg-icon";
import { EditorModule } from "../shared/editor/editor.module";

@NgModule({
    imports: [
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        NgbModule,
        CommonModule,
        SearchAdditionalButtonsModule,
        FormsModule,
        MatDividerModule,
        AngularSvgIconModule,
        ReactiveFormsModule,
        EditorModule,
    ],
    exports: [DatasetCreateComponent],
    declarations: [DatasetCreateComponent],
})
export class DatasetCreateModule {
    public static forRoot(): ModuleWithProviders<DatasetCreateModule> {
        return { ngModule: DatasetCreateModule };
    }
}
