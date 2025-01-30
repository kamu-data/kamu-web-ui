import { BaseComponent } from "src/app/common/components/base.component";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileUrlFormType } from "./file-from-url-modal.types";

@Component({
    selector: "app-file-from-url-modal",
    templateUrl: "./file-from-url-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileFromUrlModalComponent extends BaseComponent {
    public activeModal = inject(NgbActiveModal);
    private fb = inject(FormBuilder);

    public fileUrlForm: FormGroup<FileUrlFormType> = this.fb.group({
        fileUrl: ["", [Validators.required]],
    });
}
