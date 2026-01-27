/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/common/components/base.component";
import { FileFromUrlModalComponent } from "../file-from-url-modal/file-from-url-modal.component";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { FileUploadService } from "src/app/services/file-upload.service";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { AppConfigService } from "src/app/app-config.service";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { MatIconModule } from "@angular/material/icon";
import { FeatureFlagDirective } from "../../../../../common/directives/feature-flag.directive";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    selector: "app-add-data-modal",
    templateUrl: "./add-data-modal.component.html",
    styleUrls: ["./add-data-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MatIconModule,
        MatDividerModule,
        //-----//
        FeatureFlagDirective,
    ]
})
export class AddDataModalComponent extends BaseComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input() public overview?: OverviewUpdate;

    public ngbActiveModal = inject(NgbActiveModal);
    private ngbModalService = inject(NgbModal);
    private fileUploadService = inject(FileUploadService);
    private configService = inject(AppConfigService);
    private modalService = inject(ModalService);

    public get hasPollingSource(): boolean {
        return Boolean(this.overview?.overview.metadata.currentPollingSource);
    }

    public get hasPushSource(): boolean {
        return Boolean(this.overview?.overview.metadata.currentPushSources.length);
    }

    public onFileSelected(event: Event): void {
        this.ngbActiveModal.close();
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            const file: File = input.files[0];
            const fileSizeMb = file.size * Math.pow(10, -6);
            if (fileSizeMb <= this.configService.ingestUploadFileLimitMb) {
                this.fileUploadService.uploadFile(file, this.datasetBasics).subscribe();
            } else {
                promiseWithCatch(
                    this.modalService.warning({
                        title: "Warning",
                        message: `Maximum file size ${this.configService.ingestUploadFileLimitMb} MB`,
                        yesButtonText: "Ok",
                    }),
                );
            }
        }
    }

    public onAddUrl(): void {
        this.ngbModalService.open(FileFromUrlModalComponent);
        this.ngbActiveModal.close();
    }
}
