import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";

import { SqlEditorComponent } from "./components/sql-editor/sql-editor.component";
import { YamlEditorComponent } from "./components/yaml-editor/yaml-editor.component";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [SqlEditorComponent, YamlEditorComponent],
    imports: [CommonModule, FormsModule, MonacoEditorModule, MonacoEditorModule],
    exports: [SqlEditorComponent],
})
export class EditorModule {}
