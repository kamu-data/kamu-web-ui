/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import * as monaco from "monaco-editor";
import { EditorComponent } from "ngx-monaco-editor-v2";

import { BaseEditorComponent } from "src/app/editor/components/base-editor/base-editor.component";
import { MONACO_EDITOR_CONFIG_PROVIDER } from "src/app/editor/editor.providers";

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
    imports: [
        //-----//
        FormsModule,
        NgStyle,
        //-----//
        EditorComponent,
    ],
    providers: [MONACO_EDITOR_CONFIG_PROVIDER],
})
export class YamlEditorComponent extends BaseEditorComponent {
    public readonly YAML_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = YAML_EDITOR_OPTIONS;
}
