import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/common/base.component";
import { FileFromUrlModalComponent } from "../file-from-url-modal/file-from-url-modal.component";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { FileUploadService } from "src/app/services/file-upload.service";

@Component({
    selector: "app-add-data-modal",
    templateUrl: "./add-data-modal.component.html",
    styleUrls: ["./add-data-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDataModalComponent extends BaseComponent {
    @Input() public datasetBasics: DatasetBasicsFragment;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private fileUploadService: FileUploadService,
    ) {
        super();
    }

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            const file: File = input.files[0];
            this.trackSubscription(
                this.fileUploadService.uploadFile(file, this.datasetBasics).subscribe(() => {
                    this.activeModal.close();
                }),
            );
        }
    }

    public onAddUrl(): void {
        this.modalService.open(FileFromUrlModalComponent);
        this.activeModal.close();
    }
}
