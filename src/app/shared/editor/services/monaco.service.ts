import { Injectable } from "@angular/core";
import * as monaco from "monaco-editor";
import { MaybeNull, MaybeUndefined } from "../../../common/app.types";

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

        const markerData = this.prepareMarkerData(error, monaco);
        monaco.editor.setModelMarkers(model, "", [markerData]);
    }

    clearErrorMarker(model: monaco.editor.ITextModel): void {
        const monaco = getMonacoNamespace();

        if (!monaco) return;

        monaco.editor.setModelMarkers(model, "", []);
    }

    private prepareMarkerData(error: string, monacoNamespace: typeof monaco): monaco.editor.IMarkerData {
        const { line, col } = this.getErrorPos(error);

        return {
            startLineNumber: line ?? 1,
            startColumn: col ?? 1,
            endLineNumber: line ?? 9999,
            endColumn: 9999,
            message: error,
            severity: monacoNamespace.MarkerSeverity.Error,
        };
    }

    private getErrorPos(error: string): { line: number | undefined; col: number | undefined } {
        const lineMatch = error.match(/Line: (\d+)/);
        const colMathc = error.match(/Column (\d+)/);
        const line = lineMatch ? Number(lineMatch[1]) : undefined;
        const col = colMathc ? Number(colMathc[1]) : undefined;

        return { line, col };
    }
}
