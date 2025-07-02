/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import * as monaco from "monaco-editor";
import { BaseEditorComponent } from "../base-editor/base-editor.component";
import { NgStyle } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";

const YAML_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: "vs",
    language: "yaml",
    renderLineHighlight: "none",
    minimap: {
        enabled: false,
    },
    scrollBeyondLastLine: false,
};

@Component({
    selector: "app-yaml-editor",
    templateUrl: "./yaml-editor.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        NgStyle,

        //-----//
        MonacoEditorModule,
    ],
})
export class YamlEditorComponent extends BaseEditorComponent {
    public readonly YAML_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = YAML_EDITOR_OPTIONS;
}
