import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { EditKeyValueModalComponent } from "./components/edit-key-value-modal/edit-key-value-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "src/app/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { PageBasedInfo } from "src/app/api/kamu.graphql.interface";

export interface EnvVariableElement {
    key: string;
    value: string;
    secret?: boolean;
}

const ELEMENT_DATA: EnvVariableElement[] = [
    { key: "key1", value: "value1" },
    { key: "key2", value: "value2", secret: true },
];

@Component({
    selector: "app-dataset-settings-secrets-manager-tab",
    templateUrl: "./dataset-settings-secrets-manager-tab.component.html",
    styleUrls: ["./dataset-settings-secrets-manager-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsSecretsManagerTabComponent implements OnInit {
    public readonly DISPLAY_COLUMNS: string[] = ["key", "value", "actions"];
    public dataSource = new MatTableDataSource(ELEMENT_DATA);
    public currentPage = 1;
    @ViewChild(MatSort) sort: MatSort;
    public pageBasedInfo: PageBasedInfo = {
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1,
    };

    constructor(
        private ngbModalService: NgbModal,
        private modalService: ModalService,
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    public onAddOrEditRow(index: number): void {
        const modalRef = this.ngbModalService.open(EditKeyValueModalComponent);
        const modalRefInstance = modalRef.componentInstance as EditKeyValueModalComponent;
        modalRefInstance.keyValueForm.reset();
        if (index !== -1) {
            modalRefInstance.row = ELEMENT_DATA[index];
        }
    }

    public onDelete(index: number): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Delete",
                message: "Do you want to delete a row?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        ELEMENT_DATA.splice(index, 1);
                        this.dataSource.data = ELEMENT_DATA;
                    }
                },
            }),
        );
    }
}
