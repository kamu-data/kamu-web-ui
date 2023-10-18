import { Injectable } from "@angular/core";
import * as monaco from "monaco-editor";
import { MaybeNull } from "../../../common/app.types";
/* eslint-disable */
export function getMonacoNamespace(): typeof monaco {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    return (window as any).monaco as typeof monaco;
}

@Injectable({
    providedIn: "root",
})
export class MonacoService {
    public setErrorMarker(model: monaco.editor.ITextModel, error: MaybeNull<string>): void {
        const monaco = getMonacoNamespace();

        if (!monaco) return;

        if (error) {
            const markerData = this.prepareMarkerData(error);
            monaco.editor.setModelMarkers(model, "", [markerData]);
        } else {
            monaco.editor.setModelMarkers(model, "", []);
        }
    }

    private prepareMarkerData(error: string): monaco.editor.IMarkerData {
        const { line, col } = this.getErrorPos(error);

        return {
            startLineNumber: line || 1,
            startColumn: col || 1,
            endLineNumber: line || 9999,
            endColumn: 9999,
            message: error,
            severity: getMonacoNamespace().MarkerSeverity.Error,
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
