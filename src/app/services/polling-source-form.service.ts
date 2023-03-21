/* eslint-disable @typescript-eslint/unbound-method */
import { FormBuilder } from "@angular/forms";
import { Injectable } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import AppValues from "../common/app.values";

@Injectable({
    providedIn: "root",
})
export class PollingSourceFormService {
    // fetch
    private fetchUrlForm: FormGroup = this.fb.group({
        kind: ["url"],
        url: [
            "",
            [Validators.required, Validators.pattern(AppValues.URL_PATTERN)],
        ],
    });

    private fetchFilesGlobForm: FormGroup = this.fb.group({
        kind: ["filesGlob"],
        path: ["", [Validators.required]],
    });

    private fetchContainerForm: FormGroup = this.fb.group({
        kind: ["container"],
        image: ["", [Validators.required]],
    });

    public fetchFormByKind: Record<string, FormGroup> = {
        url: this.fetchUrlForm,
        filesGlob: this.fetchFilesGlobForm,
        container: this.fetchContainerForm,
    };
    // end fetch
    // read
    private readCsvForm: FormGroup = this.fb.group({
        kind: ["csv"],
        separator: [""],
    });

    private readJsonLinesForm: FormGroup = this.fb.group({
        kind: ["jsonLines"],
        dateFormat: [""],
    });

    private readGeoJsonForm: FormGroup = this.fb.group({
        kind: ["geoJson"],
    });

    private readEsriShapefileForm: FormGroup = this.fb.group({
        kind: ["esriShapefile"],
    });

    private readParquetForm: FormGroup = this.fb.group({
        kind: ["parquet"],
    });

    public readFormByKind: Record<string, FormGroup> = {
        csv: this.readCsvForm,
        jsonLines: this.readJsonLinesForm,
        geoJson: this.readGeoJsonForm,
        esriShapefile: this.readEsriShapefileForm,
        parquet: this.readParquetForm,
    };
    // end read
    // merge
    private mergeAppendForm: FormGroup = this.fb.group({
        kind: ["append"],
    });

    private mergeLedgerForm: FormGroup = this.fb.group({
        kind: ["ledger"],
    });

    private mergeSnapshotForm: FormGroup = this.fb.group({
        kind: ["snapshot"],
    });

    public mergeFormByKind: Record<string, FormGroup> = {
        append: this.mergeAppendForm,
        snapshot: this.mergeSnapshotForm,
        ledger: this.mergeLedgerForm,
    };
    // end merge

    constructor(private fb: FormBuilder) {}
}
