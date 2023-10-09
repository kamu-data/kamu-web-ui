import { Injectable } from "@angular/core";

/* eslint-disable */
@Injectable({
    providedIn: "root",
})
export class MonacoService {
    public setErrorMarker(model: any, data: any): void {
        const monaco = (window as any).monaco;
        const markerOptions = {
            ...data,
            severity: (<any>window).monaco.MarkerSeverity.Error,
        };

        monaco.editor.setModelMarkers(model, "", [markerOptions]);
    }
}
