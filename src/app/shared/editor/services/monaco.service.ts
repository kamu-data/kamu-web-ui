import { Injectable } from "@angular/core";
import * as monaco from "monaco-editor";
import { MaybeUndefined } from "../../../common/app.types";

export function getMonacoNamespace(): MaybeUndefined<typeof monaco> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    return (window as any).monaco as MaybeUndefined<typeof monaco>;
}

@Injectable({
    providedIn: "root",
})
export class MonacoService {
    public setErrorMarker(model: monaco.editor.ITextModel, error: string): void {
        const monaco = getMonacoNamespace();

        if (!monaco) return;

        const markerData = this.prepareMarkerData(model, error, monaco);
        monaco.editor.setModelMarkers(model, "", [markerData]);
    }

    clearErrorMarker(model: monaco.editor.ITextModel): void {
        const monaco = getMonacoNamespace();

        if (!monaco) return;

        monaco.editor.setModelMarkers(model, "", []);
    }

    private prepareMarkerData(
        model: monaco.editor.ITextModel,
        error: string,
        monacoNamespace: typeof monaco,
    ): monaco.editor.IMarkerData {
        const { line, col } = this.getErrorPos(error);
        const maxLines = model.getLineCount();
        const maxLastLineColumns = model.getLineMaxColumn(maxLines);

        return {
            startLineNumber: line ?? 1,
            startColumn: col ?? 1,
            endLineNumber: line ?? maxLines,
            endColumn: maxLastLineColumns,
            message: error,
            severity: monacoNamespace.MarkerSeverity.Error,
        };
    }

    private getErrorPos(error: string): { line: number | undefined; col: number | undefined } {
        const lineMatch = error.match(/Line: (\d+)/);
        const colMath = error.match(/Column (\d+)/);
        const line = lineMatch ? Number(lineMatch[1]) : undefined;
        const col = colMath ? Number(colMath[1]) : undefined;

        return { line, col };
    }
}
