import { EditorError } from "../models/error.model";
import { getMonacoNamespace } from "../services/monaco.service";

const monacoNamespace = getMonacoNamespace();
const defaultSeverity = 8;

export function getSqlError(error: string): EditorError {
    const lineMatch = error.match(/Line: (\d+)/);
    const colMath = error.match(/Column (\d+)/);
    const line = lineMatch ? Number(lineMatch[1]) : undefined;
    const col = colMath ? Number(colMath[1]) : undefined;

    return {
        message: error,
        severity: monacoNamespace?.MarkerSeverity.Error ?? defaultSeverity,
        line,
        col,
    };
}

export function getDefaultError(error: string): EditorError {
    return {
        message: error,
        severity: monacoNamespace?.MarkerSeverity.Error ?? defaultSeverity,
    };
}
