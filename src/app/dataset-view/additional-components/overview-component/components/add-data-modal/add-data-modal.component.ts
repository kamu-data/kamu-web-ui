/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AppConfigService } from "src/app/app-config.service";
import { FileFromUrlModalComponent } from "src/app/dataset-view/additional-components/overview-component/components/file-from-url-modal/file-from-url-modal.component";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { FileUploadService } from "src/app/services/file-upload.service";

import { BaseComponent } from "@common/components/base.component";
import { ModalService } from "@common/components/modal/modal.service";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";

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
    ],
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
