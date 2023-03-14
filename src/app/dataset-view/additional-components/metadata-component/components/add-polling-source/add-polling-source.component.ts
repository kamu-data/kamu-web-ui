import { BaseComponent } from "src/app/common/base.component";
/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as monaco from "monaco-editor";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-add-polling-source",
    templateUrl: "./add-polling-source.component.html",
    styleUrls: ["./add-polling-source.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPollingSourceComponent extends BaseComponent implements OnInit {
    public currentStep = 1;
    public yamlTemplate =
        "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: setPollingSource\n";

    public readonly sqlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
        {
            theme: "vs",
            language: "yaml",
            renderLineHighlight: "none",
            minimap: {
                enabled: false,
            },
        };

    //    fetch step
    public fetchUrlForm: FormGroup = this.fb.group({
        kind: ["url"],
        url: [
            "",
            [Validators.required, Validators.pattern(AppValues.URL_PATTERN)],
        ],
    });

    public fetchFilesGlobForm: FormGroup = this.fb.group({
        kind: ["filesGlob"],
        path: ["", [Validators.required]],
    });

    public fetchContainerForm: FormGroup = this.fb.group({
        kind: ["container"],
        image: ["", [Validators.required]],
    });

    private fetchFormByKind: Record<string, FormGroup> = {
        url: this.fetchUrlForm,
        filesGlob: this.fetchFilesGlobForm,
        container: this.fetchContainerForm,
    };
    //    end fetch step

    // read step
    public readCsvForm: FormGroup = this.fb.group({
        kind: ["csv"],
        separator: [""],
    });

    public readJsonLinesForm: FormGroup = this.fb.group({
        kind: ["jsonLines"],
        dateFormat: [""],
    });

    private readFormByKind: Record<string, FormGroup> = {
        csv: this.readCsvForm,
        jsonLines: this.readJsonLinesForm,
    };
    // end read step

    // merge step
    public mergeAppendForm: FormGroup = this.fb.group({
        kind: ["append"],
    });

    public mergeLedgerForm: FormGroup = this.fb.group({
        kind: ["ledger"],
    });

    public mergeSnapshotForm: FormGroup = this.fb.group({
        kind: ["snapshot"],
    });

    // private readFormByKind: Record<string, FormGroup> = {
    //     csv: this.readCsvForm,
    //     jsonLines: this.readJsonLinesForm,
    // }
    // end merge

    public pollingSourceForm: FormGroup = this.fb.group({
        fetch: this.fetchFormByKind[
            this.fetchUrlForm.controls.kind.value as string
        ],
        read: this.readFormByKind[
            this.readCsvForm.controls.kind.value as string
        ],
        merge: this.mergeAppendForm,
    });

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.fetchKindChanges();
    }

    public nextStep(): void {
        this.currentStep++;
    }

    public prevStep(): void {
        this.currentStep--;
    }

    private fetchKindChanges(): void {
        this.trackSubscriptions(
            this.fetchUrlForm.controls.kind.valueChanges.subscribe(() => {
                this.pollingSourceForm.controls.fetch =
                    this.fetchFormByKind[
                        this.fetchUrlForm.controls.kind.value as string
                    ];
            }),
            this.readCsvForm.controls.kind.valueChanges.subscribe(() => {
                this.pollingSourceForm.controls.read =
                    this.readFormByKind[
                        this.readCsvForm.controls.kind.value as string
                    ];
            }),
        );
    }
}
