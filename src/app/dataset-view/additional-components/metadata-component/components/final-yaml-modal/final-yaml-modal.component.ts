/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { BehaviorSubject } from "rxjs";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { BaseComponent } from "@common/components/base.component";
import { trackBusy } from "@common/helpers/app.helpers";
import { DatasetInfo } from "@interface/navigation.interface";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { YamlEditorComponent } from "src/app/editor/components/yaml-editor/yaml-editor.component";

@Component({
    selector: "app-final-yaml-modal",
    templateUrl: "./final-yaml-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        //-----//
        YamlEditorComponent,
    ],
})
export class FinalYamlModalComponent extends BaseComponent {
    @Input({ required: true }) public yamlTemplate: string;
    @Input({ required: true }) public datasetInfo: DatasetInfo;
    @Input({ required: true }) public enabledSaveBtn = true;

    public readonly busy$ = new BehaviorSubject<boolean>(false);

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
            .pipe(trackBusy(this.busy$), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.activeModal.close(this.yamlTemplate));
    }
}
