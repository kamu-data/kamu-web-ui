import { Injectable } from "@angular/core";
import * as monaco from "monaco-editor";
import { getMonacoNamespace } from "./monaco-namespace.helper";

@Injectable({
    providedIn: "root",
})
export class MonacoService {
    public setErrorMarker(model: monaco.editor.ITextModel, markerData: monaco.editor.IMarkerData): void {
        getMonacoNamespace().editor.setModelMarkers(model, "", [markerData]);
    }
}
