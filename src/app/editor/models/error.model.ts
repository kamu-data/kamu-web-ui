import { MarkerSeverity } from "monaco-editor";

export interface EditorError {
    line?: number;
    col?: number;
    severity: MarkerSeverity;
    message: string;
}
