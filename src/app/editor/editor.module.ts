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
import packageFile from "package.json";

import { SqlEditorComponent } from "src/app/editor/components/sql-editor/sql-editor.component";
import { YamlEditorComponent } from "src/app/editor/components/yaml-editor/yaml-editor.component";

const MONACO_VERSION = packageFile.dependencies["monaco-editor"].replace(/[\^~]/g, "");

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MonacoEditorModule.forRoot({ baseUrl: `./assets/monaco-${MONACO_VERSION}/min/vs` }),
        SqlEditorComponent,
        YamlEditorComponent,
    ],
    exports: [SqlEditorComponent, YamlEditorComponent],
})
export class EditorModule {}
