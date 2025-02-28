/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";

import { SqlEditorComponent } from "./components/sql-editor/sql-editor.component";
import { YamlEditorComponent } from "./components/yaml-editor/yaml-editor.component";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [SqlEditorComponent, YamlEditorComponent],
    imports: [CommonModule, FormsModule, MonacoEditorModule.forRoot()],
    exports: [SqlEditorComponent, YamlEditorComponent],
})
export class EditorModule {}
