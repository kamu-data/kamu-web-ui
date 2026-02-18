/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MonacoEditorModule } from "ngx-monaco-editor-v2";

import { SqlEditorComponent } from "src/app/editor/components/sql-editor/sql-editor.component";
import { YamlEditorComponent } from "src/app/editor/components/yaml-editor/yaml-editor.component";

@NgModule({
    imports: [CommonModule, FormsModule, MonacoEditorModule.forRoot(), SqlEditorComponent, YamlEditorComponent],
    exports: [SqlEditorComponent, YamlEditorComponent],
})
export class EditorModule {}
