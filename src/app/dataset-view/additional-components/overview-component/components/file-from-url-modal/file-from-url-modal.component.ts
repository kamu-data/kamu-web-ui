import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-file-from-url-modal",
    templateUrl: "./file-from-url-modal.component.html",
    styleUrls: ["./file-from-url-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileFromUrlModalComponent extends BaseComponent implements OnInit {
    public fileUrlForm: FormGroup = this.fb.group({
        fileUrl: ["", [Validators.required]],
    });

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {}

    public saveFileUrl(): void {
        console.log("form=", this.fileUrlForm.value);
    }
}
