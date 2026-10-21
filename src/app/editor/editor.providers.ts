/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Provider } from "@angular/core";

import { NGX_MONACO_EDITOR_CONFIG, NgxMonacoEditorConfig } from "ngx-monaco-editor-v2";

import { MONACO_VERSION } from "src/app/editor/generated/monaco-version";

const MONACO_EDITOR_CONFIG: NgxMonacoEditorConfig = {
    baseUrl: `./assets/monaco-${MONACO_VERSION}/min/vs`,
};

/**
 * Tells ngx-monaco-editor where to load Monaco from: the copy angular.json places under assets.
 * Declared in each editor component's `providers`; `provideMonacoEditor()` returns environment
 * providers, which a component cannot declare.
 */
export const MONACO_EDITOR_CONFIG_PROVIDER: Provider = {
    provide: NGX_MONACO_EDITOR_CONFIG,
    useValue: MONACO_EDITOR_CONFIG,
};
