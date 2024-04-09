import { MaybeNull } from "../../../../../../../common/app.types";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EnvVariableElement } from "../../dataset-settings-secrets-manager-tab.component";

@Component({
    selector: "app-edit-key-value-modal",
    templateUrl: "./edit-key-value-modal.component.html",
    styleUrls: ["./edit-key-value-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditKeyValueModalComponent implements OnInit {
    @Input() public row: MaybeNull<EnvVariableElement>;
    public keyValueForm: FormGroup = this.fb.group({
        key: ["", [Validators.required]],
        value: ["", [Validators.required]],
        secretKey: [false],
    });

    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        if (this.row) {
            this.keyValueForm.patchValue({
                key: this.row.key,
                value: this.row.value,
                secretKey: this.row.secret,
            });
        }
    }

    public onEditRow(): void {
        //  console.log("edit");
    }
}
