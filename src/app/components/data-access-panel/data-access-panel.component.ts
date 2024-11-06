import { MaybeUndefined } from "./../../common/app.types";
import { ProtocolsService } from "./../../services/protocols.service";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { DatasetBasicsFragment, DatasetEndpoints } from "src/app/api/kamu.graphql.interface";
import { Observable } from "rxjs";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { DataAccessModalComponent } from "./data-access-modal/data-access-modal.component";

@Component({
    selector: "app-data-access-panel",
    templateUrl: "./data-access-panel.component.html",
    styleUrls: ["./data-access-panel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAccessPanelComponent implements OnInit {
    @Input({ required: true }) datasetBasics: DatasetBasicsFragment;
    public protocols$: Observable<MaybeUndefined<DatasetEndpoints>>;

    private protocolsService = inject(ProtocolsService);
    private ngbModalService = inject(NgbModal);

    ngOnInit(): void {
        this.initClipboardHints();
    }

    private initClipboardHints(): void {
        this.protocols$ = this.protocolsService.getProtocols({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public openDataAccessModal(): void {
        const modalRef: NgbModalRef = this.ngbModalService.open(DataAccessModalComponent, {
            size: "lg",
            centered: true,
        });
        const modalRefInstance = modalRef.componentInstance as DataAccessModalComponent;
        modalRefInstance.protocols$ = this.protocols$;
    }
}
