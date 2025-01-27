import { ModuleWithProviders, NgModule } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { DatasetCreateComponent } from "./dataset-create.component";
import { SearchAdditionalButtonsModule } from "../common/components/search-additional-buttons/search-additional-buttons.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { EditorModule } from "../shared/editor/editor.module";
import { SharedModule } from "../shared/shared/shared.module";

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
        ReactiveFormsModule,
        EditorModule,
        SharedModule,
    ],
    exports: [DatasetCreateComponent],
    declarations: [DatasetCreateComponent],
})
export class DatasetCreateModule {
    public static forRoot(): ModuleWithProviders<DatasetCreateModule> {
        return { ngModule: DatasetCreateModule };
    }
}
