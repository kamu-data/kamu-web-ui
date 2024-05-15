import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NgbActiveModal, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { BaseComponent } from "src/app/common/base.component";
import { FileFromUrlModalComponent } from "../file-from-url-modal/file-from-url-modal.component";
import { MaybeNull } from "src/app/common/app.types";

@Component({
    selector: "app-add-data-modal",
    templateUrl: "./add-data-modal.component.html",
    styleUrls: ["./add-data-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDataModalComponent extends BaseComponent implements OnInit {
    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
    ) {
        super();
    }

    ngOnInit(): void {}

    public onFileSelected(event: Event): Promise<MaybeNull<string>> {
        return new Promise<string>((resolve) => {
            const input = event.target as HTMLInputElement;
            if (!input.files?.length) {
                resolve("");
            } else {
                const file: File = input.files[0];
                console.log("file", file);
            }
        });
    }

    public onAddUrl(): void {
        const modalRef: NgbModalRef = this.modalService.open(FileFromUrlModalComponent);
        const modalRefInstance = modalRef.componentInstance as FileFromUrlModalComponent;
        this.activeModal.close();
    }
}
