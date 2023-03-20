import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as monaco from "monaco-editor";

import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

import { DatasetInfo } from "src/app/interface/navigation.interface";

import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-final-yaml-modal",
    templateUrl: "./final-yaml-modal.component.html",
    styleUrls: ["./final-yaml-modal.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalYamlModalComponent extends BaseComponent {
    @Input() public yamlTemplate: string;
    @Input() datasetInfo: DatasetInfo;
    public readonly sqlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
        {
            theme: "vs",
            language: "yaml",
            renderLineHighlight: "none",
            minimap: {
                enabled: false,
            },
        };

    constructor(
        public activeModal: NgbActiveModal,
        private createDatasetService: AppDatasetCreateService,
        private navigationService: NavigationService,
    ) {
        super();
    }

    public saveEvent(): void {
        this.trackSubscription(
            this.createDatasetService
                .commitEventToDataset(
                    this.datasetInfo.accountName,
                    this.datasetInfo.datasetName,
                    this.yamlTemplate,
                )
                .subscribe(() => {
                    this.activeModal.close("close modal");
                    this.navigationService.navigateToDatasetView({
                        ...this.datasetInfo,
                        tab: DatasetViewTypeEnum.Metadata,
                    });
                }),
        );
    }
}
