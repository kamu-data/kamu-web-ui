/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BaseComponent } from "src/app/common/components/base.component";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize } from "rxjs";
import { YamlEditorComponent } from "../../../../../editor/components/yaml-editor/yaml-editor.component";
import { EditorModule } from "src/app/editor/editor.module";

@Component({
    selector: "app-final-yaml-modal",
    templateUrl: "./final-yaml-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        YamlEditorComponent,
        //-----//
        EditorModule,
    ],
})
export class FinalYamlModalComponent extends BaseComponent {
    @Input({ required: true }) public yamlTemplate: string;
    @Input({ required: true }) public datasetInfo: DatasetInfo;
    @Input({ required: true }) public enabledSaveBtn = true;

    public activeModal = inject(NgbActiveModal);
    private datasetCommitService = inject(DatasetCommitService);
    private loggedUserService = inject(LoggedUserService);

    public saveEvent(): void {
        this.datasetCommitService
            .commitEventToDataset({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                accountName: this.datasetInfo.accountName,
                datasetName: this.datasetInfo.datasetName,
                event: this.yamlTemplate,
            })
            .pipe(
                finalize(() => this.activeModal.close(this.yamlTemplate)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }
}
