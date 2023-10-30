import { Injectable } from "@angular/core";
import * as monaco from "monaco-editor";
import { MaybeUndefined } from "../../../common/app.types";
import { EditorError } from "../models/error.model";

export function getMonacoNamespace(): MaybeUndefined<typeof monaco> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    return (window as any).monaco as MaybeUndefined<typeof monaco>;
}

@Injectable({
    providedIn: "root",
})
export class MonacoService {
    public setErrorMarker(model: monaco.editor.ITextModel, error: EditorError): void {
        const monaco = getMonacoNamespace();

        if (!monaco) return;

        const markerData = this.prepareMarkerData(model, error);
        monaco.editor.setModelMarkers(model, "", [markerData]);
    }

    public clearErrorMarker(model: monaco.editor.ITextModel): void {
        const monaco = getMonacoNamespace();

        if (!monaco) return;

        monaco.editor.setModelMarkers(model, "", []);
    }

    private prepareMarkerData(model: monaco.editor.ITextModel, error: EditorError): monaco.editor.IMarkerData {
        const maxLines = model.getLineCount();
        const maxLastLineColumns = model.getLineMaxColumn(maxLines);

        return {
            startLineNumber: error.line ?? 1,
            startColumn: error.col ?? 1,
            endLineNumber: error.line ?? maxLines,
            endColumn: maxLastLineColumns,
            message: error.message,
            severity: error.severity,
        };
    }
}
