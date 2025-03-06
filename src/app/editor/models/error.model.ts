/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MarkerSeverity } from "monaco-editor";

export interface EditorError {
    line?: number;
    col?: number;
    severity: MarkerSeverity;
    message: string;
}
