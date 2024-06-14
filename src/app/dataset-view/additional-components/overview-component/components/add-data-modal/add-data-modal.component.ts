import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/common/base.component";
import { FileFromUrlModalComponent } from "../file-from-url-modal/file-from-url-modal.component";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { FileUploadService } from "src/app/services/file-upload.service";
import { ModalService } from "src/app/components/modal/modal.service";
import { AppConfigService } from "src/app/app-config.service";
import { promiseWithCatch } from "src/app/common/app.helpers";

@Component({
    selector: "app-add-data-modal",
    templateUrl: "./add-data-modal.component.html",
    styleUrls: ["./add-data-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDataModalComponent extends BaseComponent {
    @Input() public datasetBasics: DatasetBasicsFragment;

    constructor(
        public ngbActiveModal: NgbActiveModal,
        private ngbModalService: NgbModal,
        private fileUploadService: FileUploadService,
        private configService: AppConfigService,
        private modalService: ModalService,
    ) {
        super();
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
