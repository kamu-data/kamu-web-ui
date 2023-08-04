import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as monaco from "monaco-editor";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";

@Component({
    selector: "app-final-yaml-modal",
    templateUrl: "./final-yaml-modal.component.html",
    styleUrls: ["./final-yaml-modal.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalYamlModalComponent extends BaseComponent {
    @Input() public yamlTemplate: string;
    @Input() public datasetInfo: DatasetInfo;
    @Input() public enabledSaveBtn = true;
    public readonly yamlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
        theme: "vs",
        language: "yaml",
        renderLineHighlight: "none",
        minimap: {
            enabled: false,
        },
        scrollBeyondLastLine: false,
    };

    constructor(public activeModal: NgbActiveModal, private datasetCommitService: DatasetCommitService) {
        super();
    }

    public saveEvent(): void {
        this.trackSubscription(
            this.datasetCommitService
                .commitEventToDataset(this.datasetInfo.accountName, this.datasetInfo.datasetName, this.yamlTemplate)
                .subscribe(),
        );
        this.activeModal.close(this.yamlTemplate);
    }
}
